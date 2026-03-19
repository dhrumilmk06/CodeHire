import 'dotenv/config'
import { GoogleGenerativeAI } from '@google/generative-ai'

console.log("TEST SCRIPT - Loading Key from .env:", process.env.GEMINI_API_KEY)

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: Your GEMINI_API_KEY is undefined according to testai.mjs! Did you forget to save the .env file?")
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Use Flash-Lite — highest free quota
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

const result = await model.generateContent('Say hello to CodeHire')

console.log(result.response.text())