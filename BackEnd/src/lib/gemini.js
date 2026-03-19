import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash-lite'
})

export const generateAIResponse = async (prompt) => {
  try {
    const result = await geminiModel.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    if (error.status === 429) {
      throw new Error('AI service is busy. Please try again in a moment.')
    }
    throw new Error('AI service unavailable')
  }
}