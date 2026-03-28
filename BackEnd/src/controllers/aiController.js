import { generateAIResponse } from '../lib/gemini.js'
import { prisma } from '../lib/db.js'

export const generateCodeHint = async (req, res) => {
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

    // Build Gemini prompt
    const prompt = `
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

    const hint = await generateAIResponse(prompt)

    // Save hint to session database
    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    })

    const existingHints = session.hints || []

    await prisma.session.update({
      where: { id: sessionId },
      data: {
        hints: [
          ...existingHints,
          {
            hint: hint.trim(),
            timestamp: new Date().toISOString(),
            problemTitle
          }
        ]
      }
    })

    return res.json({
      success: true,
      hint: hint.trim()
    })

  } catch (error) {
    console.error('AI hint error:', error)
    return res.status(500).json({
      error: error.message || 'Could not generate hint'
    })
  }
}

export const generateCodeReview = async (req, res) => {
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

    // Build Gemini prompt for structured review
    const prompt = `
You are an expert technical interviewer and code reviewer.

Analyze this coding interview submission:

Problem: ${problemTitle}
Description: ${problemDescription}
Language: ${language || 'JavaScript'}
Time Taken: ${timeTaken}
Auto Score: ${score}

Candidate's Code:
${candidateCode}

Provide a detailed structured code review.
Return ONLY a valid JSON object with NO extra text:

{
  "summary": "2-3 sentence overall assessment",
  "timeComplexity": "O(?) with brief explanation",
  "spaceComplexity": "O(?) with brief explanation",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2"],
  "codeQuality": "Excellent/Good/Average/Poor",
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
        problemSolvingApproach: 'Solution provided',
        overallRating: 5,
        recommendation: 'Maybe',
        recommendationReason: 'Manual review recommended'
      }
    }

    // Save AI review to session
    await prisma.session.update({
      where: { id: sessionId },
      data: { ai_review: review }
    })

    return res.json({
      success: true,
      review
    })

  } catch (error) {
    console.error('AI code review error:', error)
    return res.status(500).json({
      error: error.message || 'Could not generate code review'
    })
  }
}

export const generateProblem = async (req, res) => {
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
    console.error('AI problem generation error:', error)
    if (error.status === 429) {
      return res.status(429).json({
        error: 'AI service busy. Please wait a moment and try again.'
      })
    }
    return res.status(500).json({
      error: 'Could not generate problem. Please try again.'
    })
  }
}

export const generateSolution = async (req, res) => {
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
    console.error('Solution generation error:', error)
    if (error.status === 429 || error.message?.includes('busy')) {
      return res.status(429).json({
        error: 'AI is busy. Please wait a moment and try again.'
      })
    }
    return res.status(500).json({
      error: error.message || 'Could not generate solution. Please try again.'
    })
  }

}

