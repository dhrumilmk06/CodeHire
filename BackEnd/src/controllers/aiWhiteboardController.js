import { prisma } from '../lib/db.js';
import { geminiModel } from '../lib/gemini.js';

export const reviewWhiteboardDesign = async (req, res, next) => {
    try {
        const { snapshotId, sessionId, designContext } = req.body;

        if (!snapshotId || !sessionId) {
            return res.status(400).json({ success: false, error: 'snapshotId and sessionId are required' });
        }

        // 1. Fetch snapshot from DB
        const snapshot = await prisma.whiteboardSnapshot.findUnique({
            where: { id: snapshotId },
        });

        if (!snapshot) {
            return res.status(404).json({ success: false, error: 'Snapshot not found' });
        }

        if (!snapshot.imageData) {
            return res.status(400).json({ success: false, error: 'Snapshot has no image data' });
        }

        // 2. Strip the data URI prefix — Gemini needs raw base64
        const base64Data = snapshot.imageData.replace(/^data:image\/\w+;base64,/, '');

        // 3. Build the Gemini vision prompt
        const prompt = `You are an expert system design interviewer reviewing a candidate's whiteboard diagram.

Problem context: ${designContext || 'System design interview'}

Carefully analyze the diagram and evaluate:
1. Completeness — are core components present (load balancer, database, cache, services, clients)?
2. Scalability — does the architecture handle increased load?
3. Single points of failure or bottlenecks
4. What the candidate did well
5. Specific improvements to suggest

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "score": <0-100>,
  "completeness": { "score": <0-100>, "feedback": "<string>" },
  "scalability": { "score": <0-100>, "feedback": "<string>" },
  "strengths": ["<string>"],
  "issues": ["<string>"],
  "improvements": ["<string>"],
  "summary": "<2-3 sentence overall assessment>"
}`;

        // 4. Call Gemini with vision (inlineData)
        const result = await geminiModel.generateContent([
            {
                inlineData: {
                    mimeType: 'image/png',
                    data: base64Data,
                },
            },
            { text: prompt },
        ]);

        const rawResponse = result.response.text();

        // 5. Parse JSON response robustly
        let review;
        try {
            const start = rawResponse.indexOf('{');
            const end = rawResponse.lastIndexOf('}');
            if (start === -1 || end === -1) throw new Error('No JSON found');
            review = JSON.parse(rawResponse.substring(start, end + 1));
        } catch {
            // Fallback if Gemini doesn't return clean JSON
            review = {
                score: 50,
                completeness: { score: 50, feedback: 'Unable to parse AI response. Manual review required.' },
                scalability: { score: 50, feedback: 'Unable to parse AI response. Manual review required.' },
                strengths: ['Design submitted successfully'],
                issues: ['AI analysis could not be fully parsed'],
                improvements: ['Try re-analyzing or submit a clearer diagram'],
                summary: rawResponse.slice(0, 300),
            };
        }

        // 6. Persist aiScore and aiFeedback back to the snapshot row
        await prisma.whiteboardSnapshot.update({
            where: { id: snapshotId },
            data: {
                aiScore: Math.round(review.score ?? 0),
                aiFeedback: JSON.stringify(review),
            },
        });

        return res.json({
            success: true,
            data: review,
        });

    } catch (error) {
        console.error('[AI Whiteboard] Review failed:', error);
        next(error);
    }
};
