/**
 * geminiReviewService.js
 *
 * Handles AI-powered code review for Bug Bounty submissions via Google Gemini.
 * Uses the existing gemini-2.5-flash-lite model from lib/gemini.js.
 */

import { generateAIResponse } from '../lib/gemini.js';

// ---------------------------------------------------------------------------
// reviewBugFix
// ---------------------------------------------------------------------------

/**
 * Reviews a bug fix submission using Gemini AI.
 *
 * @param {string} buggyCode      - The original buggy code
 * @param {string} fixedCode      - The candidate's fixed code
 * @param {string} language       - Programming language (e.g. "javascript")
 * @param {string} bugDescription - Description of the bug to fix
 * @returns {{ correctnessScore, qualityScore, efficiencyScore, avgScore, feedback, error? }}
 */
export async function reviewBugFix(buggyCode, fixedCode, language, bugDescription) {
  const prompt = `You are an expert code reviewer. A developer was given buggy code and asked to fix it.

Bug Description: ${bugDescription}

Original Buggy Code (${language}):
${buggyCode}

Fixed Code (${language}):
${fixedCode}

Evaluate the fix on these three dimensions:
1. Correctness (0-100): Does the fix actually solve the described bug?
2. Code Quality (0-100): Is the fix clean, readable, and well-structured?
3. Efficiency (0-100): Is the solution efficient, no unnecessary changes?

Also write 2-3 sentences of actionable feedback for the developer.

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "correctnessScore": 85,
  "qualityScore": 80,
  "efficiencyScore": 90,
  "avgScore": 85,
  "feedback": "Your fix correctly addresses the off-by-one error..."
}`;

  try {
    const rawResponse = await generateAIResponse(prompt);

    // Strip potential markdown code fences from Gemini response
    const cleaned = rawResponse
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // JSON parse failed — return safe fallback
      console.error('[GeminiReview] Failed to parse JSON response:', cleaned.slice(0, 200));
      return {
        avgScore: 0,
        feedback: 'AI review unavailable at this time.',
        error: true,
      };
    }

    // Validate and extract scores, always recalculate avgScore ourselves
    const correctnessScore = Number(parsed.correctnessScore) || 0;
    const qualityScore     = Number(parsed.qualityScore)     || 0;
    const efficiencyScore  = Number(parsed.efficiencyScore)  || 0;
    const avgScore         = Math.round((correctnessScore + qualityScore + efficiencyScore) / 3);
    const feedback         = parsed.feedback || 'No feedback provided.';

    return {
      correctnessScore,
      qualityScore,
      efficiencyScore,
      avgScore,
      feedback,
    };
  } catch (err) {
    // Any error (network, Gemini API failure) — do NOT throw, return safe fallback
    console.error('[GeminiReview] AI review failed:', err.message);
    return {
      avgScore: 0,
      feedback: 'AI review unavailable at this time.',
      error: true,
    };
  }
}

// ---------------------------------------------------------------------------
// explainBugFix
// ---------------------------------------------------------------------------

export async function explainBugFix(buggyCode, correctSolution, language, bugDescription) {
  const prompt = `
You are a coding instructor. A student fixed a buggy piece of code. Explain the fix clearly.

Bug Description: ${bugDescription}

Buggy Code (${language}):
${buggyCode}

Fixed Code (${language}):
${correctSolution}

Write a clear explanation (3-5 sentences) that covers:
1. What exactly was wrong in the buggy code
2. Why it caused incorrect behavior
3. What the fix does and why it works

Keep it beginner-friendly. No JSON, just plain text explanation.
  `.trim();

  try {
    const response = await generateAIResponse(prompt);
    return response;
  } catch (err) {
    console.error('[GeminiReview] AI explanation failed:', err.message);
    return 'Explanation unavailable at this time.';
  }
}
