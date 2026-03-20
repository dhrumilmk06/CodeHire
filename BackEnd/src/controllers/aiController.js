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
