# 💡 AI Code Hints Feature — CodeHire

## Overview

This document covers the complete implementation of the **AI Code Hints** feature for CodeHire using **Google Gemini API (gemini-2.5-flash-lite model)**. The host can trigger an AI-generated hint that appears as a glowing suggestion box in the candidate's editor without giving away the answer.

---

## 🔄 Complete Flow

```
Host sees candidate stuck
      ↓
Host clicks "💡 Send AI Hint" button
      ↓
Button shows "Generating Hint..." spinner
      ↓
Backend sends problem + candidate code to Gemini
      ↓
Gemini returns hint in 1-2 seconds
      ↓
Backend saves hint to session database
      ↓
Socket.io sends hint to candidate screen in real time
      ↓
Candidate sees glowing green hint box appear below editor
      ↓
Host sees "✅ Hint sent to candidate" confirmation
```

---

## ⚠️ IMPORTANT — Database Safety

Before making ANY changes run this backup command:

```bash
pg_dump -U postgres -d codehire -f codehire_backup_hints.sql
```

---

## 🗄️ Step 1 — Setup Gemini in Backend

Create `BackEnd/src/lib/gemini.js`:

```javascript
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
```

Add to `BackEnd/.env`:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🎮 Step 2 — Create AI Controller

Create `BackEnd/src/controllers/aiController.js`:

```javascript
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
```

---

## 🛣️ Step 3 — Add Route

Create `BackEnd/src/routes/aiRoutes.js`:

```javascript
import express from 'express'
import { generateCodeHint } from '../controllers/aiController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.post('/hint', requireAuth, generateCodeHint)

export default router
```

Register in `BackEnd/src/index.js`:

```javascript
import aiRoutes from './routes/aiRoutes.js'

app.use('/api/ai', aiRoutes)
```

---

## 🗄️ Step 4 — Update Database Safely

### Sub-Step 4A — Add hints column via SQL in pgAdmin

Open pgAdmin → CodeHire database → Query Tool → Run:

```sql
ALTER TABLE "Session"
ADD COLUMN IF NOT EXISTS "hints" JSONB NOT NULL DEFAULT '[]';
```

### Sub-Step 4B — Verify column was added

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Session'
ORDER BY ordinal_position;
```

You should see `hints` in the list.

### Sub-Step 4C — Update schema.prisma

Add ONE line only to your existing Session model:

```prisma
model Session {
  // all your existing fields stay exactly the same
  // only add this one line below:
  hints    Json  @default("[]")
}
```

### Sub-Step 4D — Generate Prisma client only

```bash
# NO migration — just regenerate client
npx prisma generate
```

### ❌ Never run these

```bash
❌ npx prisma migrate dev
❌ npx prisma migrate reset
❌ npx prisma db push --force-reset
```

---

## 🔌 Step 5 — Socket.io Event

In your existing Socket.io server file add this event:

```javascript
// When host sends a hint
socket.on('send-hint', ({ sessionId, hint }) => {
  // Send hint ONLY to candidate in same session room
  // NOT back to host
  socket.to(sessionId).emit('receive-hint', { hint })
})
```

---

## 🖥️ Step 6 — Frontend Host Side

In your interview page component add these states and function:

```jsx
// States — add at top of component
const [isLoadingHint, setIsLoadingHint] = useState(false)
const [showHintSent, setShowHintSent] = useState(false)

// Send hint function
const sendHint = async () => {
  setIsLoadingHint(true)
  setShowHintSent(false)

  try {
    const response = await fetch('/api/ai/hint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        sessionId: session.id,
        problemTitle: currentProblem.title,
        problemDescription: currentProblem.description.text,
        candidateCode: currentCode
      })
    })

    const data = await response.json()

    if (data.hint) {
      // Send hint to candidate via Socket.io
      socket.emit('send-hint', {
        sessionId: session.id,
        hint: data.hint
      })

      setShowHintSent(true)

      // Hide confirmation after 3 seconds
      setTimeout(() => setShowHintSent(false), 3000)
    }

  } catch (error) {
    console.error('Error sending hint:', error)
  } finally {
    setIsLoadingHint(false)
  }
}
```

Add this JSX in the host-only section of your interview page — place it near the Run Code button area:

```jsx
{isHost && (
  <div className="flex flex-col gap-2">

    {/* Send Hint Button */}
    <button
      onClick={sendHint}
      disabled={isLoadingHint}
      className="
        flex items-center gap-2
        bg-[#111111] border border-[#22c55e]
        text-[#22c55e] text-sm font-medium
        px-4 py-2 rounded-lg cursor-pointer
        hover:bg-[#22c55e] hover:text-black
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {isLoadingHint ? (
        <>
          <span className="animate-spin inline-block">⟳</span>
          <span>Generating Hint...</span>
        </>
      ) : (
        <>
          <span>💡</span>
          <span>Send AI Hint</span>
        </>
      )}
    </button>

    {/* Sent Confirmation — shows for 3 seconds */}
    {showHintSent && (
      <p className="text-green-500 text-xs flex items-center gap-1">
        ✅ Hint sent to candidate
      </p>
    )}

  </div>
)}
```

---

## 📱 Step 7 — Frontend Candidate Side

In your interview page component add hint display for candidate:

```jsx
// States — add at top of component
const [receivedHint, setReceivedHint] = useState('')
const [showHint, setShowHint] = useState(false)

// Listen for hint from Socket.io
useEffect(() => {
  socket.on('receive-hint', ({ hint }) => {
    setReceivedHint(hint)
    setShowHint(true)
  })

  // Cleanup on unmount
  return () => {
    socket.off('receive-hint')
  }
}, [socket])
```

Add this JSX below the code editor — candidate only:

```jsx
{isParticipant && showHint && receivedHint && (
  <div className="
    bg-[#111111]
    border border-[#22c55e]
    rounded-xl p-4 mt-3
    shadow-[0_0_15px_rgba(34,197,94,0.2)]
    transition-all duration-500
  ">

    {/* Header row */}
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span>💡</span>
        <span className="
          text-[#22c55e] text-sm font-semibold
        ">
          AI Hint
        </span>
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => setShowHint(false)}
        className="
          text-[#888888] hover:text-white
          text-xs transition-colors duration-200
        "
      >
        ✕ Dismiss
      </button>
    </div>

    {/* Hint text */}
    <p className="text-white text-sm leading-relaxed">
      {receivedHint}
    </p>

  </div>
)}
```

---

## 🎨 Step 8 — Add Tailwind Animation

In your `tailwind.config.js` add custom animation:

```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)'  }
        }
      },
      animation: {
        'slide-up': 'slide-up 0.4s ease-out forwards'
      }
    }
  }
}
```

Then add `animate-slide-up` class to the hint box div.

---

## 🧪 How to Test After Implementation

```
Step 1 — Open two browser windows
         Window 1 → Login as Host
         Window 2 → Login as Participant

Step 2 — Host creates a session
         Participant joins via invite link

Step 3 — Participant writes some code
         (even just the starter code is fine)

Step 4 — Host clicks "💡 Send AI Hint" button
         Button should show "Generating Hint..." spinner

Step 5 — After 1-2 seconds:
         Host sees "✅ Hint sent to candidate"
         Participant sees green glowing hint box appear

Step 6 — Verify hint makes sense for the problem
         It should nudge without giving the answer

Step 7 — Participant clicks "✕ Dismiss"
         Hint box disappears cleanly

Step 8 — Check pgAdmin Session table
         hints column should have the hint saved as JSON
```

---

## 🎨 UI Result After Implementation

**Host sees:**
```
┌─────────────────────────────────────┐
│  JS ▼  Live          [Run Code]     │
│  function twoSum(nums, target) {    │
│    // Write your solution here      │
│  }                                  │
├─────────────────────────────────────┤
│  [💡 Send AI Hint]                  │
│  ✅ Hint sent to candidate          │
└─────────────────────────────────────┘
```

**Candidate sees:**
```
┌─────────────────────────────────────┐
│  JS ▼  Live          [Run Code]     │
│  function twoSum(nums, target) {    │
│    // Write your solution here      │
│  }                                  │
├─────────────────────────────────────┤
│ 💡 AI Hint                    [✕]   │
│ Think about using a data structure  │
│ that gives you O(1) lookup time —   │
│ what if you stored values you have  │
│ already seen?                       │
└─────────────────────────────────────┘
```

---

## 📅 Implementation Order

```
Day 1 Morning   → Step 1 (Gemini setup)
Day 1 Morning   → Step 2 (AI controller)
Day 1 Morning   → Step 3 (Routes)
Day 1 Afternoon → Step 4 (Database — SQL only, no migration)
Day 1 Afternoon → Step 5 (Socket.io event)
Day 1 Evening   → Step 6 (Host button UI)
Day 1 Evening   → Step 7 (Candidate hint display)
Day 2           → Step 8 (Animation) + Full end to end testing
```

---

## ✅ Do NOT Change

- Existing code editor component
- Existing Socket.io room logic
- Existing Run Code functionality
- Existing Auto Score panel
- Existing Notes button
- Existing video panel
- Navbar or any other page
- Any existing API endpoints
- Any existing Prisma models except adding hints to Session
