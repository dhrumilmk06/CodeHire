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
