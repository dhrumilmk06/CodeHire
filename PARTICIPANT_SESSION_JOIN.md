# 🚀 Feature: Participant Session Join via Dashboard — CodeHire

## Overview

This document covers the complete implementation of the **Participant Session Join** feature for CodeHire. Currently participants join sessions by opening a raw link in the browser. This feature adds a **Quick Join panel directly on the participant dashboard** so they can paste a session link OR enter a short code without ever leaving the app.

---

## 🔄 Current Flow vs New Flow

| | Current Flow | New Flow |
|---|---|---|
| Host shares | Full URL via chat/email | Short code (e.g. `ABC-XYZ`) OR full URL |
| Participant | Opens link in browser manually | Pastes link/code directly in dashboard |
| Entry point | External browser tab | Dashboard → Quick Join card |

---

## ⚠️ CRITICAL — Database Safety Rules

> Running `npx prisma migrate dev` on an existing database **WILL wipe all your data**.
> Follow the safe SQL approach below for ALL database changes.

**Backup before anything:**
```bash
pg_dump -U postgres -d codehire -f codehire_backup_joinfeature.sql
```

---

## 🗄️ Step 1 — Database Changes (Safe SQL Approach)

### Sub-Step 1A — Add session_code column via pgAdmin

Open pgAdmin → CodeHire database → Query Tool → Run:

```sql
-- Add session_code column
ALTER TABLE "Session"
ADD COLUMN IF NOT EXISTS "session_code" TEXT;

-- Add UNIQUE constraint at database level
ALTER TABLE "Session"
ADD CONSTRAINT "Session_session_code_key" UNIQUE ("session_code");
```

### Sub-Step 1B — Verify column was added

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Session'
ORDER BY ordinal_position;
```

You should see `session_code` in the list.

### Sub-Step 1C — Update schema.prisma manually

Add ONE line only to your existing Session model:

```prisma
model Session {
  // all your existing fields stay exactly the same
  // only add this one line:
  session_code String? @unique
}
```

### Sub-Step 1D — Generate Prisma client only

```bash
# NO migration — just regenerate client
npx prisma generate
```

### ❌ Never run these commands

```bash
❌ npx prisma migrate dev
❌ npx prisma migrate reset
❌ npx prisma db push --force-reset
```

---

## 🛠️ Step 2 — Session Code Generation Utility

Create `BackEnd/src/utils/sessionHelpers.js`:

```javascript
/**
 * Generates a unique 6-character uppercase alphanumeric
 * session code in format ABC-XYZ
 */
export function generateSessionCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  const part1 = Array(3)
    .fill(0)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('')

  const part2 = Array(3)
    .fill(0)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('')

  return `${part1}-${part2}`
}

/**
 * Extracts session ID from a full URL
 * e.g. http://localhost:5173/session/abc123 → abc123
 */
export function extractSessionIdFromUrl(url) {
  try {
    const urlObj = new URL(url)
    const parts = urlObj.pathname.split('/')
    const sessionIndex = parts.indexOf('session')
    if (sessionIndex !== -1 && parts[sessionIndex + 1]) {
      return parts[sessionIndex + 1]
    }
    return null
  } catch {
    return null
  }
}

/**
 * Detects if input is a URL or a short code
 */
export function detectInputType(input) {
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return 'url'
  }
  return 'code'
}
```

---

## 🎮 Step 3 — Update Session Creation Endpoint

In your existing session creation controller find the `createSession` function and update it to auto-generate a session code:

```javascript
import { generateSessionCode } from '../utils/sessionHelpers.js'
import { prisma } from '../lib/db.js'

export const createSession = async (req, res) => {
  try {
    const { problemIds, hostId } = req.body

    // Generate unique session code
    // Keep generating until we find one that doesn't exist
    let sessionCode
    let isUnique = false

    while (!isUnique) {
      sessionCode = generateSessionCode()
      const existing = await prisma.session.findUnique({
        where: { session_code: sessionCode }
      })
      if (!existing) isUnique = true
    }

    // Create session with generated code
    const session = await prisma.session.create({
      data: {
        hostId,
        problemIds,
        session_code: sessionCode,
        status: 'active'
        // all your other existing fields stay same
      }
    })

    return res.json({
      success: true,
      session: {
        ...session,
        session_code: sessionCode  // include in response
      }
    })

  } catch (error) {
    console.error('Create session error:', error)
    return res.status(500).json({ error: 'Could not create session' })
  }
}
```

---

## 🔌 Step 4 — Join Session Endpoints

### Install Rate Limiting

```bash
npm install express-rate-limit
```

### Create Join Controller

Add these functions to your existing session controller:

```javascript
import rateLimit from 'express-rate-limit'
import { extractSessionIdFromUrl, detectInputType } from '../utils/sessionHelpers.js'

// Rate limiter — max 10 join attempts per minute per IP
export const joinSessionLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 10,                    // max 10 attempts
  message: {
    error: 'Too many join attempts. Please wait a minute and try again.'
  }
})

// POST /api/sessions/join
export const joinSession = async (req, res) => {
  try {
    const { code, link } = req.body
    const userId = req.user.id

    // Must provide either code or link
    if (!code && !link) {
      return res.status(400).json({
        error: 'Please provide a session code or link'
      })
    }

    let session = null

    if (code) {
      // Join by short code
      // Always normalize to UPPERCASE before lookup
      const normalizedCode = code.trim().toUpperCase()

      session = await prisma.session.findUnique({
        where: { session_code: normalizedCode },
        include: { host: { select: { id: true, name: true } } }
      })

    } else if (link) {
      // Join by full URL — extract session ID
      const inputType = detectInputType(link)

      if (inputType !== 'url') {
        return res.status(400).json({
          error: 'Invalid link format. Please paste a valid session URL.'
        })
      }

      const sessionId = extractSessionIdFromUrl(link)

      if (!sessionId) {
        return res.status(400).json({
          error: 'Could not extract session ID from this link.'
        })
      }

      session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { host: { select: { id: true, name: true } } }
      })
    }

    // Session not found
    if (!session) {
      return res.status(404).json({
        error: 'Invalid link or code. Please check and try again.'
      })
    }

    // Session has ended
    if (session.status === 'ended' || session.status === 'closed') {
      return res.status(400).json({
        error: 'This session has ended and is no longer available.'
      })
    }

    // Check if participant trying to join their own hosted session
    if (session.hostId === userId) {
      return res.status(400).json({
        error: 'You cannot join a session you are hosting.'
      })
    }

    // Check if session is full
    if (session.participantId && session.participantId !== userId) {
      return res.status(400).json({
        error: 'This session is full. Maximum 2 participants allowed.'
      })
    }

    // Update session with participant
    await prisma.session.update({
      where: { id: session.id },
      data: { participantId: userId }
    })

    return res.json({
      success: true,
      sessionId: session.id,
      redirectUrl: `/session/${session.id}`,
      hostName: session.host.name
    })

  } catch (error) {
    console.error('Join session error:', error)
    return res.status(500).json({
      error: 'Could not join session. Please try again.'
    })
  }
}
```

### Register Route

In your session routes file add:

```javascript
import { joinSession, joinSessionLimiter } from '../controllers/sessionController.js'

// POST — use POST not GET for security reasons
router.post('/join', requireAuth, joinSessionLimiter, joinSession)
```

---

## 🖥️ Step 5 — Host Dashboard Update

Update the existing `HostSessionCard` component to show the session code:

```jsx
// HostSessionCard.jsx — add these inside the existing card

const copyCode = () => {
  navigator.clipboard.writeText(session.session_code)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}

const shareLink = () => {
  const url = `${window.location.origin}/session/${session.id}`
  navigator.clipboard.writeText(url)
  setShared(true)
  setTimeout(() => setShared(false), 2000)
}

// Add this JSX inside the existing card — below the problem title
{session.session_code && (
  <div className="
    flex items-center gap-2 mt-2
    bg-[#0a0a0a] border border-[#2a2a2a]
    rounded-lg px-3 py-2
  ">
    {/* Code display */}
    <span className="text-[#22c55e] font-mono font-bold text-sm tracking-widest">
      {session.session_code}
    </span>

    {/* Copy code button */}
    <button
      onClick={copyCode}
      className="
        ml-auto text-xs
        text-[#888888] hover:text-[#22c55e]
        transition-colors duration-200
      "
    >
      {copied ? '✅ Copied' : '📋 Copy Code'}
    </button>

    {/* Share link button */}
    <button
      onClick={shareLink}
      className="
        text-xs
        text-[#888888] hover:text-[#22c55e]
        transition-colors duration-200
      "
    >
      {shared ? '✅ Copied' : '🔗 Share Link'}
    </button>
  </div>
)}
```

---

## 📱 Step 6 — QuickJoinCard Component

Create new file `FrontEnd/src/components/dashboard/QuickJoinCard.jsx`:

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuickJoinCard() {
  const navigate = useNavigate()

  const [urlInput, setUrlInput]       = useState('')
  const [codeInput, setCodeInput]     = useState('')
  const [isLoading, setIsLoading]     = useState(false)
  const [error, setError]             = useState('')

  const handleJoin = async (type) => {
    setIsLoading(true)
    setError('')

    const body = type === 'url'
      ? { link: urlInput.trim() }
      : { code: codeInput.trim().toUpperCase() }

    // Validate input before sending
    if (type === 'url' && !urlInput.trim()) {
      setError('Please paste a session link')
      setIsLoading(false)
      return
    }

    if (type === 'code' && !codeInput.trim()) {
      setError('Please enter a session code')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/sessions/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Could not join session')
        return
      }

      // Success — redirect to session
      navigate(data.redirectUrl)

    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="
      bg-[#111111] border border-[#2a2a2a]
      rounded-xl p-6 mb-6
      transition-all duration-300
      hover:border-[#22c55e]
      hover:shadow-[0_0_15px_rgba(34,197,94,0.1)]
    ">

      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[#22c55e] text-lg">⚡</span>
        <h2 className="text-white font-bold text-lg">Quick Join</h2>
      </div>

      {/* Info hint */}
      <p className="text-[#888888] text-sm mb-5">
        Ask your host to share the session link or code
      </p>

      {/* URL Input Section */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value)
            setError('')
          }}
          placeholder="Paste session link here..."
          className="
            flex-1 bg-[#0a0a0a] border border-[#2a2a2a]
            text-white text-sm placeholder-[#555555]
            rounded-lg px-4 py-2.5
            focus:outline-none focus:border-[#22c55e]
            transition-colors duration-200
          "
        />
        <button
          onClick={() => handleJoin('url')}
          disabled={isLoading || !urlInput.trim()}
          className="
            bg-[#22c55e] text-black text-sm font-semibold
            px-5 py-2.5 rounded-lg
            hover:bg-[#16a34a] transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            whitespace-nowrap
          "
        >
          {isLoading ? '⟳ Joining...' : 'Join'}
        </button>
      </div>

      {/* OR Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-[#2a2a2a]" />
        <span className="text-[#555555] text-xs font-medium">OR</span>
        <div className="flex-1 h-px bg-[#2a2a2a]" />
      </div>

      {/* Code Input Section */}
      <div className="flex gap-2">
        <input
          type="text"
          value={codeInput}
          onChange={(e) => {
            setCodeInput(e.target.value.toUpperCase())
            setError('')
          }}
          placeholder="Enter code e.g. ABC-XYZ"
          maxLength={10}
          className="
            flex-1 bg-[#0a0a0a] border border-[#2a2a2a]
            text-[#22c55e] font-mono font-bold text-sm
            placeholder-[#555555] tracking-widest
            rounded-lg px-4 py-2.5
            focus:outline-none focus:border-[#22c55e]
            transition-colors duration-200
          "
        />
        <button
          onClick={() => handleJoin('code')}
          disabled={isLoading || !codeInput.trim()}
          className="
            bg-[#111111] border border-[#22c55e]
            text-[#22c55e] text-sm font-semibold
            px-5 py-2.5 rounded-lg
            hover:bg-[#22c55e] hover:text-black
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            whitespace-nowrap
          "
        >
          {isLoading ? '⟳ Joining...' : 'Join with Code'}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-2 mt-3">
          <span className="animate-spin text-[#22c55e]">⟳</span>
          <span className="text-[#888888] text-sm">Connecting to session...</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="
          mt-3 bg-red-500/10 border border-red-500/30
          rounded-lg px-4 py-2
        ">
          <p className="text-red-400 text-sm">❌ {error}</p>
        </div>
      )}

    </div>
  )
}
```

---

## 🖥️ Step 7 — Add QuickJoinCard to Participant Dashboard

In your existing `ParticipantDashboard.jsx` import and add the component:

```jsx
// Add import at top
import QuickJoinCard from '../components/dashboard/QuickJoinCard'

// Add component between welcome header and past sessions
return (
  <div className="...existing dashboard classes...">

    {/* Existing welcome header — NO CHANGES */}
    <WelcomeHeader />

    {/* ADD QuickJoinCard HERE — between header and past sessions */}
    <QuickJoinCard />

    {/* Existing past sessions section — NO CHANGES */}
    <PastSessionsSection />

  </div>
)
```

---

## 🔒 Security Rules Summary

| Rule | Implementation |
|------|---------------|
| UNIQUE constraint | Added at DB level via SQL |
| UPPERCASE only | Normalized before insert AND before lookup |
| POST not GET | Join endpoint uses POST to hide code from logs |
| Auth required | requireAuth middleware on join endpoint |
| Rate limiting | 10 attempts per minute per IP |
| Code expires | Checked session status before allowing join |
| Never reuse codes | New code generated for every new session |

---

## 🔀 Edge Cases Handled

| Scenario | Response |
|----------|----------|
| Invalid code | 404 "Invalid link or code" |
| Session ended | 400 "This session has ended" |
| Session full | 400 "This session is full" |
| Own session | 400 "You cannot join your own session" |
| No auth | 401 Unauthorized |
| Rate limited | 429 "Too many attempts" |
| Empty input | Frontend validation error |

---

## 🧪 Testing Checklist

```
Database
  □ session_code column exists with UNIQUE constraint
  □ All existing session data intact

Backend
  □ POST /api/sessions creates session with session_code
  □ POST /api/sessions/join works with valid code
  □ POST /api/sessions/join works with valid URL
  □ Returns 404 for invalid code
  □ Returns 400 for ended session
  □ Returns 400 for full session
  □ Returns 401 without auth token
  □ Lowercase codes normalized to uppercase
  □ Rate limit blocks after 10 attempts

Host Dashboard
  □ Session card shows session_code
  □ Copy code button works
  □ Share link button works

Participant Dashboard
  □ QuickJoinCard visible above past sessions
  □ URL paste input redirects correctly
  □ Code input auto-uppercases
  □ Loading spinner shows while joining
  □ Error messages show for all failure cases
  □ Success redirects to /session/:id
```

---

## 📅 Implementation Order

```
Phase 1 → Database (do yourself)          → 20 min
Phase 2 → sessionHelpers utility          → 30 min
Phase 3 → Session creation update         → 1 hour
Phase 4 → Join endpoints                  → 1.5 hours
Phase 5 → Host dashboard update           → 1 hour
Phase 6 → QuickJoinCard component         → 1.5 hours
Phase 7 → Add to participant dashboard    → 30 min
Testing → Full end to end                 → 1 hour
```

---

## ✅ Do NOT Change

- Existing session creation logic other than adding session_code
- Existing host dashboard layout
- Existing participant dashboard layout other than adding QuickJoinCard
- Existing Socket.io events
- Existing auth middleware
- Any other existing API endpoints
- Navbar or any other page
