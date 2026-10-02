import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Model fallback chain — active free-tier Gemini models.
// NOTE: gemini-2.5-flash-lite is a "thinking" model that wraps responses in
// <think>...</think> blocks — stripThinkingTags() handles this safely.
const MODEL_CHAIN = [
  'gemini-2.5-flash-lite',   // Primary: active, high-speed, free quota
  'gemini-flash-lite-latest',// Fallback 1: latest flash-lite alias
  'gemini-3.5-flash-lite',   // Fallback 2: next-gen flash-lite
  'gemini-flash-latest',     // Fallback 3: standard flash model
]

// Retryable HTTP status codes (rate-limit / server overload)
const RETRYABLE_STATUSES = new Set([429, 503])

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Strip <think>...</think> blocks emitted by Gemini thinking models
 * (e.g. gemini-2.5-flash-lite) so JSON parsing works correctly.
 */
const stripThinkingTags = (text) =>
  text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()

/**
 * Call Gemini with automatic retries + model fallback.
 *
 * Strategy:
 *  1. Try each model in MODEL_CHAIN.
 *  2. For each model, retry up to maxRetries times on 429/503,
 *     with exponential back-off (2s -> 4s).
 *  3. Wait 1s between switching models to avoid burst limits.
 *  4. If all models are exhausted, throw a user-friendly error.
 */
export const generateAIResponse = async (prompt, maxRetries = 1) => {
  let lastError

  for (let modelIdx = 0; modelIdx < MODEL_CHAIN.length; modelIdx++) {
    const modelName = MODEL_CHAIN[modelIdx]
    const model = genAI.getGenerativeModel({ model: modelName })

    // Small pause before trying each fallback model (skip for first model)
    if (modelIdx > 0) await sleep(1000)

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent(prompt)
        const raw = result.response.text()

        if (modelIdx > 0) {
          console.log(`[Gemini] Used fallback model: ${modelName}`)
        }

        // Strip thinking tags before returning (safe no-op for non-thinking models)
        return stripThinkingTags(raw)
      } catch (error) {
        lastError = error

        const status = error.status ?? error?.response?.status
        const isRetryable = RETRYABLE_STATUSES.has(status)

        if (!isRetryable) {
          // Non-retryable (e.g. 404 model not found) — skip to next model immediately
          console.warn(`[Gemini] ${modelName} error (status ${status}): ${error.message}`)
          break
        }

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt + 1) * 1000 // 2s, 4s
          console.warn(`[Gemini] ${modelName} returned ${status}. Retrying in ${delay}ms...`)
          await sleep(delay)
        } else {
          console.warn(`[Gemini] ${modelName} exhausted retries (${status}). Trying next model...`)
        }
      }
    }
  }

  // All models failed
  console.error('[Gemini] All models failed. Last error:', lastError?.message)
  const status = lastError?.status ?? lastError?.response?.status
  if (status === 429 || status === 503) {
    throw new Error('AI service is currently unavailable due to high demand. Please try again in a moment.')
  }
  throw lastError
}

// Keep named export for backward compatibility
export const geminiModel = genAI.getGenerativeModel({ model: MODEL_CHAIN[0] })