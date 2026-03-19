import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyDWQzFlQUxmoGHQ_TzeG0mqCmHpBlJZdvM')

// Use Flash-Lite — highest free quota
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

const result = await model.generateContent('Say hello to CodeHire')

console.log(result.response.text())