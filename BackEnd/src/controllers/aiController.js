import { generateAIResponse } from '../lib/gemini.js'
import { prisma } from '../lib/db.js'
import { executeCode, validateCodeHintForSession } from '../services/codeExecutionService.js'

export const generateCodeHint = async (req, res, next) => {

  try {
    const {
      sessionId,
      problemTitle,
      problemDescription,
      candidateCode
    } = req.body

    // Only host can trigger hints
    if (req.user.role !== 'host') {
      return res.status(403).json({
        error: 'Only host can send hints'
      })
    }

    // Validate required fields
    if (!problemTitle || !candidateCode) {
      return res.status(400).json({
        error: 'Problem title and candidate code are required'
      })
    }

    // ── Step 1: Generate the text hint (unchanged behaviour) ──────────────
    const textPrompt = `
You are a helpful coding interview assistant.

Problem: ${problemTitle}
Description: ${problemDescription}

Candidate current code:
${candidateCode}

Give ONE helpful hint that nudges the candidate
in the right direction WITHOUT giving the answer.

Strict Rules:
- Maximum 2 sentences only
- Be encouraging and positive
- Do NOT write any code
- Do NOT give the direct answer
- Focus on approach or data structure to think about
- Start with "Think about..." or "Consider..." or "Have you thought about..."

Hint:
`
    const hint = await generateAIResponse(textPrompt)

    // ── Step 2: Fetch session to get language + problem ID ─────────────
    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    })

    const existingHints = session?.hints || []
    const sessionLanguage = session?.language || 'javascript'

    // ── Step 3: Generate a code scaffold hint via Gemini ──────────────
    // This is a PARTIAL scaffold — not a full solution, just enough to
    // guide the candidate toward the right approach.
    let codeHint          = null
    let codeHintValidation = null

    try {
      const scaffoldPrompt = `
You are a helpful coding interview assistant.

Problem: ${problemTitle}
Description: ${problemDescription}
Language: ${sessionLanguage}

Candidate's current (incomplete/incorrect) code:
${candidateCode}

Generate a PARTIAL code scaffold that:
- Shows the correct structure/approach without revealing the full solution
- Has TODO comments for the parts the candidate still needs to fill in
- Is runnable (syntactically valid)
- Nudges the candidate toward the right algorithm

Strict Rules:
- Return ONLY the code, no explanation, no markdown backticks
- Must be valid ${sessionLanguage} code
- Leave the core logic as TODO for the candidate to implement
- Should be shorter than the full solution

Scaffold:
`
      const rawScaffold = await generateAIResponse(scaffoldPrompt)

      // Strip any accidental markdown fences
      const cleanScaffold = rawScaffold
        .replace(/```[a-z]*/gi, '')
        .replace(/```/g, '')
        .trim()

      if (cleanScaffold) {
        // ── Step 4 (Phase 5 core): Validate the scaffold against hidden test cases
        const validation = await validateCodeHintForSession(
          sessionId,
          cleanScaffold,
          sessionLanguage
        )

        codeHint = cleanScaffold
        codeHintValidation = {
          isValid:         validation.isValid,
          testCasesPassed: validation.testCasesPassed,
          passRate:        validation.passRate,
          status:          validation.status,
        }

        // Log outcome for visibility
        console.log(
          `[generateCodeHint] Scaffold validation for session ${sessionId}:`,
          `${validation.testCasesPassed} passed, isValid=${validation.isValid}`
        )
      }
    } catch (scaffoldErr) {
      // Non-fatal — text hint still saves even if scaffold generation fails
      console.warn('[generateCodeHint] Code scaffold generation/validation skipped:', scaffoldErr.message)
    }

    // ── Step 5: Build hint entry ───────────────────────────────────────
    // Always store the text hint.
    // Only attach codeHint if it passed validation (or validation was skipped
    // due to no test cases / no code — status NO_TEST_CASES / NO_CODE).
    const hintEntry = {
      hint:      hint.trim(),
      timestamp: new Date().toISOString(),
      problemTitle,
    }

    const codeHintStorable =
      codeHint &&
      codeHintValidation &&
      (
        codeHintValidation.isValid ||
        codeHintValidation.status === 'NO_TEST_CASES' ||
        codeHintValidation.status === 'NO_CODE'
      )

    if (codeHintStorable) {
      hintEntry.codeHint           = codeHint
      hintEntry.codeHintValidation = codeHintValidation
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: {
        hints: [
          ...existingHints,
          hintEntry,
        ]
      }
    })

    return res.json({
      success:   true,
      hint:      hint.trim(),
      ...(codeHintStorable && {
        codeHint,
        codeHintValidation,
      }),
    })

  } catch (error) {
    next(error);
  }
}


export const generateCodeReview = async (req, res, next) => {

  try {
    const {
      sessionId,
      problemTitle,
      problemDescription,
      candidateCode,
      score,
      timeTaken,
      language
    } = req.body

    // Only host can generate review
    if (req.user.role !== 'host') {
      return res.status(403).json({
        error: 'Only host can generate code review'
      })
    }

    // ── Phase 3: Run code against hidden test cases ──────────────────────────
    // Defaults used when execution is skipped or fails gracefully
    let executionSummary = 'Test execution not available'
    let testCasesPassed  = null   // Will update session if we get a real result
    let failedTestsInfo  = ''

    try {
      // 1. Fetch the session to get session.problem (CustomProblem ID)
      const session = await prisma.session.findUnique({
        where: { id: sessionId }
      })

      if (session) {
        // 2. Determine which code to execute:
        //    Prefer the live code stored in session.problemCodes[language],
        //    fall back to candidateCode sent in the request body.
        const resolvedLanguage = language || session.language || 'javascript'
        const codeToRun =
          (session.problemCodes && session.problemCodes[resolvedLanguage])
          || candidateCode

        // 3. Fetch CustomProblem to get hiddenTestCases
        const customProblem = await prisma.customProblem.findUnique({
          where: { id: session.problem }
        })

        const testCases = Array.isArray(customProblem?.hiddenTestCases)
          ? customProblem.hiddenTestCases
          : []

        if (codeToRun && testCases.length > 0) {
          // 4. Execute code against hidden test cases
          const execResult = await executeCode(codeToRun, resolvedLanguage, testCases)

          testCasesPassed = execResult.testCasesPassed   // "X/Y" string

          const [passedStr, totalStr] = execResult.testCasesPassed.split('/')
          const passed = parseInt(passedStr, 10) || 0
          const total  = parseInt(totalStr,  10) || 0
          const passRate = total > 0 ? Math.round((passed / total) * 100) : 0

          // Build a human-readable summary for the Gemini prompt
          executionSummary = `Passed ${passed} of ${total} hidden test cases (${passRate}% pass rate).`

          if (execResult.failedTests?.length > 0) {
            const failDetails = execResult.failedTests
              .slice(0, 3) // Only show first 3 failures to keep prompt concise
              .map(ft =>
                `  - Test ${ft.index}: expected "${ft.expectedOutput}", got "${ft.actualOutput || ft.stderr || 'no output'}"`
              )
              .join('\n')
            failedTestsInfo = `\nFailed test details (first ${Math.min(3, execResult.failedTests.length)}):\n${failDetails}`
          }

          if (execResult.status === 'TIMEOUT') {
            executionSummary = `Code timed out during execution (exceeded 3s limit).`
          } else if (execResult.status === 'RUNTIME_ERROR') {
            executionSummary = `Runtime error during execution. ${passed} of ${total} tests passed before crash.`
          }
        }
      }
    } catch (execErr) {
      // Non-fatal — log and continue with review without execution data
      console.warn('[generateCodeReview] Code execution skipped:', execErr.message)
    }
    // ────────────────────────────────────────────────────────────────────────

    // Build enriched Gemini prompt with real test execution results
    const prompt = `
You are an expert technical interviewer and code reviewer.

Analyze this coding interview submission:

Problem: ${problemTitle}
Description: ${problemDescription}
Language: ${language || 'JavaScript'}
Time Taken: ${timeTaken}
Auto Score: ${score}

Test Execution Results:
${executionSummary}${failedTestsInfo}

Candidate's Code:
${candidateCode}

Provide a detailed structured code review. Factor in the test execution results when assessing correctness.
Return ONLY a valid JSON object with NO extra text:

{
  "summary": "2-3 sentence overall assessment mentioning test results",
  "timeComplexity": "O(?) with brief explanation",
  "spaceComplexity": "O(?) with brief explanation",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2"],
  "codeQuality": "Excellent/Good/Average/Poor",
  "correctness": "brief comment on test pass rate and correctness",
  "problemSolvingApproach": "brief description of their approach",
  "overallRating": 8,
  "recommendation": "Strong Hire/Hire/Maybe/No Hire",
  "recommendationReason": "one sentence reason"
}
`

    const aiResponse = await generateAIResponse(prompt)

    // Parse JSON response from Gemini
    let review
    try {
      // Clean response in case Gemini adds backticks
      const cleaned = aiResponse
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()
      review = JSON.parse(cleaned)
    } catch {
      // Fallback if JSON parsing fails
      review = {
        summary: aiResponse,
        timeComplexity: 'Not analyzed',
        spaceComplexity: 'Not analyzed',
        strengths: ['Code submitted successfully'],
        improvements: ['Manual review recommended'],
        codeQuality: 'Average',
        correctness: executionSummary,
        problemSolvingApproach: 'Solution provided',
        overallRating: 5,
        recommendation: 'Maybe',
        recommendationReason: 'Manual review recommended'
      }
    }

    // Attach execution metadata to the stored review object
    review.executionResult = {
      testCasesPassed: testCasesPassed || '0/0',
      summary: executionSummary
    }

    // Save AI review + testCasesPassed back to session
    const sessionUpdateData = { ai_review: review }
    if (testCasesPassed) {
      sessionUpdateData.testCasesPassed = testCasesPassed
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: sessionUpdateData
    })

    return res.json({
      success: true,
      review,
      testCasesPassed: testCasesPassed || '0/0',
      executionSummary
    })

  } catch (error) {
    next(error);
  }
}


export const generateProblem = async (req, res, next) => {

  try {
    const { difficulty, topic, companyStyle } = req.body

    // Only host can generate problems
    if (req.user.role !== 'host') {
      return res.status(403).json({
        error: 'Only hosts can generate problems'
      })
    }

    // Validate required fields
    if (!difficulty || !topic) {
      return res.status(400).json({
        error: 'Difficulty and topic are required'
      })
    }

    const prompt = `
You are an expert coding interview problem creator.

Generate a unique and original coding interview problem with these specs:
Difficulty: ${difficulty}
Topic: ${topic}
Company Style: ${companyStyle || 'General'}

Rules:
- Problem must be completely original — not a copy of existing LeetCode problems
- Must be solvable in 20-30 minutes for the given difficulty
- Examples must have clear input and output
- Hidden test cases must cover edge cases
- Starter code must have correct function signature
- For javascript hiddenTestCases use console.log(JSON.stringify(result))
- For python hiddenTestCases use import json; print(json.dumps(result, separators=(',',':')))

Return ONLY a valid JSON object with NO extra text, NO markdown, NO backticks:

{
  "title": "Problem Title Here",
  "difficulty": "${difficulty}",
  "category": "topic tags here like Array • Hash Table",
  "description": {
    "text": "Full problem description here",
    "notes": ["note 1", "note 2"]
  },
  "constraints": ["constraint 1", "constraint 2"],
  "examples": [
    {
      "input": "example input",
      "output": "example output",
      "explanation": "explanation here"
    }
  ],
  "starterCode": {
    "javascript": "function solve() {\\n  // Write your solution here\\n}",
    "python": "def solve():\\n    # Write your solution here\\n    pass",
    "java": "class Solution {\\n    public void solve() {\\n        // Write your solution here\\n    }\\n}",
    "cpp": "#include <bits/stdc++.h>\\nusing namespace std;\\n\\nclass Solution {\\npublic:\\n    void solve() {\\n        // Write your solution here\\n    }\\n};"
  },
  "hiddenTestCases": [
    {
      "id": 1,
      "description": "Basic case",
      "inputCode": {
        "javascript": "console.log(JSON.stringify(solve(input)));",
        "python": "import json\\nprint(json.dumps(solve(input), separators=(',',':')))"
      },
      "expectedOutput": "expected result here"
    }
  ]
}
`

    const aiResponse = await generateAIResponse(prompt)

    // Clean and parse JSON response from Gemini
    let generatedProblem
    try {
      const cleaned = aiResponse
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()
      generatedProblem = JSON.parse(cleaned)
    } catch {
      return res.status(500).json({
        error: 'AI returned invalid format. Please try again.'
      })
    }

    return res.json({
      success: true,
      problem: generatedProblem
    })

  } catch (error) {
    next(error);
  }
}


export const generateSolution = async (req, res, next) => {

  try {
    const {
      problemTitle,
      problemDescription,
      difficulty,
      language
    } = req.body

    if (!problemTitle || !problemDescription) {
      return res.status(400).json({
        error: 'Problem title and description are required'
      })
    }

    const prompt = `
You are an expert coding interview coach.

Generate a complete solution for this coding problem:
Problem: ${problemTitle}
Difficulty: ${difficulty || 'Medium'}
Description: ${problemDescription}
Language: ${language || 'javascript'}

Return ONLY a valid JSON object with NO extra text NO markdown NO backticks:

{
  "approach": "Clear explanation of the approach and algorithm used in 3-4 sentences",
  "timeComplexity": "O(?) with brief explanation",
  "spaceComplexity": "O(?) with brief explanation",
  "keyInsights": ["insight 1", "insight 2", "insight 3"],
  "solutions": {
    "javascript": "complete working javascript solution code here",
    "python": "complete working python solution code here",
    "java": "complete working java solution code here",
    "cpp": "complete working cpp solution code here"
  }
}
`

    const aiResponse = await generateAIResponse(prompt)

    // Clean and parse JSON response from Gemini
    let solution
    try {
      // Find the first { and last } to extract JSON from potential extra text
      const startJson = aiResponse.indexOf('{')
      const endJson = aiResponse.lastIndexOf('}')
      
      if (startJson === -1 || endJson === -1) {
        throw new Error('No valid JSON found')
      }

      const cleaned = aiResponse.substring(startJson, endJson + 1)
      solution = JSON.parse(cleaned)
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError, 'Raw Response:', aiResponse)
      return res.status(500).json({
        error: 'AI returned invalid format. Please try again.'
      })
    }


    return res.json({
      success: true,
      solution
    })

  } catch (error) {
    next(error);
  }

}


