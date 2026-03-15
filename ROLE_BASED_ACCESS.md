# 👥 Role-Based Access Control — CodeHire

## Overview

This document covers the complete implementation of **role-based access control** for CodeHire with two distinct roles — **Host (Interviewer)** and **Participant (Candidate)** — each with their own dashboard, navbar, and feature access.

---

## 🔄 Current vs New Flow

```
CURRENT:
Everyone logs in → Same dashboard → Same features

NEW:
Login
  ↓
Are you a Host or Participant? (one-time selection)
  ↓                         ↓
Host Dashboard         Participant Dashboard
  ↓                         ↓
Create Sessions        View Past Interviews
Problem Bank           See Feedback
Compare Candidates     Join Session via Link
Notes Panel            View Score History
Time Tracker           See Decision Status
Auto Score Results     Practice Problems
```

---

## 👤 Role Permissions

### Host (Interviewer)
```
✅ Create sessions
✅ Access Problem Bank
✅ Create and bulk import custom problems
✅ See Live Notes panel during interview
✅ See Auto Score results
✅ See Time Tracker
✅ Access Dashboard with past sessions
✅ Compare candidates side by side
✅ End session
✅ Generate report card
✅ Set candidate decision (Move Forward / Reject / On Hold)
❌ Cannot join as participant
❌ Cannot see My Interviews page
```

### Participant (Candidate)
```
✅ Join session via invite link
✅ See their own past interviews
✅ See feedback host chose to share
✅ See their own scores after session ends
✅ View problems they solved
❌ Cannot create sessions
❌ Cannot access Problem Bank
❌ Cannot see Notes panel
❌ Cannot see Auto Score during interview
❌ Cannot see Time Tracker
❌ Cannot access host dashboard
```

---

## 🗄️ Step 1 — Update Prisma Schema

Add `role` field to the User model in `prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String?
  role      String   @default("participant") // "host" or "participant"
  createdAt DateTime @default(now())
  sessions  Session[] @relation("HostSessions")
}
```

Then run migration:

```bash
npx prisma migrate dev --name add_role_to_user
npx prisma generate
```

---

## 🎯 Step 2 — Role Selection Screen

Create a new page at `/select-role` that appears **only once** on first login when the user has no role set yet.

### UI Layout
```
┌─────────────────────────────────────────────┐
│                                             │
│         Welcome to CodeHire! 🎉             │
│      How will you use this platform?        │
│                                             │
│  ┌───────────────┐    ┌───────────────┐     │
│  │               │    │               │     │
│  │  🎯 I am an   │    │  💻 I am a    │     │
│  │  Interviewer  │    │  Candidate    │     │
│  │  (Host)       │    │ (Participant) │     │
│  │               │    │               │     │
│  └───────────────┘    └───────────────┘     │
│                                             │
└─────────────────────────────────────────────┘
```

### Behavior
- Show this screen ONLY when `user.role` is empty or null
- On card click → call `PATCH /api/users/role` to save role
- After saving → redirect to correct dashboard:
  - Host → `/dashboard`
  - Participant → `/my-interviews`
- Never show this screen again after role is set

### Styling
- Dark background matching existing CodeHire theme `#0a0a0a`
- Cards use `#111111` background with `#2a2a2a` border
- On hover cards get green border `#22c55e` and lift effect
- Selected card gets solid green border and green glow

---

## 🔀 Step 3 — Role-Based Redirect After Login

In your Clerk auth callback after login check the user role and redirect accordingly:

```javascript
// In your auth callback / middleware
const user = await prisma.user.findUnique({
  where: { clerkId: userId }
})

// First time login — no role set yet
if (!user || !user.role || user.role === '') {
  redirect('/select-role')
}

// Host → go to host dashboard
if (user.role === 'host') {
  redirect('/dashboard')
}

// Participant → go to participant dashboard
if (user.role === 'participant') {
  redirect('/my-interviews')
}
```

---

## 🖥️ Step 4 — Participant Dashboard Page

Create a new page `/my-interviews` for participants only.

### UI Layout
```
┌─────────────────────────────────────────────┐
│  Welcome back, [Name]!                      │
│  Ready for your next interview?             │
│                        [Join Session →]     │
├─────────────────────────────────────────────┤
│  📊 Your Stats                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │    5     │  │   3.2/5  │  │    8     │  │
│  │Interviews│  │Avg Score │  │ Problems │  │
│  └──────────┘  └──────────┘  └──────────┘  │
├─────────────────────────────────────────────┤
│  📋 Your Past Interviews                    │
│                                             │
│  Two Sum     Easy    3/5   Sat Feb 28  ✅   │
│  Binary      Medium  4/5   Fri Feb 27  ✅   │
│  3Sum        Hard    2/5   Thu Feb 26  ⏳   │
└─────────────────────────────────────────────┘
```

### Past Interviews Table Columns
- Problem name + difficulty badge
- Score (e.g. 3/5 hidden tests passed) — only shown if host shared it
- Date of interview
- Feedback from host — only shown if host chose to share
- Decision badge:
  - `✅ Move Forward` — green
  - `❌ Rejected` — red
  - `⏳ Pending` — yellow

### Join Session Modal
- Opens when participant clicks `[Join Session →]`
- Simple input field to paste the session invite code or link
- On submit → redirect to `/session/:id`

---

## 🧭 Step 5 — Role-Based Navbar

Update the existing Navbar component to show different items per role:

```jsx
// Navbar.jsx

import { useUser } from '../hooks/useUser' // your existing auth hook

export default function Navbar() {
  const { user } = useUser()

  return (
    <nav className="...existing navbar classes...">
      {/* Logo — show for both roles */}
      <Logo />

      {/* Host navbar items */}
      {user?.role === 'host' && (
        <>
          <NavLink to="/problems">Problems</NavLink>
          <NavLink to="/problem-bank">Problem Bank</NavLink>
          <NavLink to="/dashboard">DashBoard</NavLink>
        </>
      )}

      {/* Participant navbar items */}
      {user?.role === 'participant' && (
        <>
          <NavLink to="/my-interviews">My Interviews</NavLink>
        </>
      )}

      {/* Avatar — show for both roles */}
      <UserAvatar />
    </nav>
  )
}
```

---

## 🔐 Step 6 — Protected Route Components

Create two route guard components to protect pages:

```jsx
// components/HostRoute.jsx
import { Navigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

export function HostRoute({ children }) {
  const { user, isLoaded } = useUser()

  if (!isLoaded) return <LoadingSpinner />

  if (!user) return <Navigate to="/sign-in" />

  if (user.role !== 'host') return <Navigate to="/my-interviews" />

  return children
}

// components/ParticipantRoute.jsx
export function ParticipantRoute({ children }) {
  const { user, isLoaded } = useUser()

  if (!isLoaded) return <LoadingSpinner />

  if (!user) return <Navigate to="/sign-in" />

  if (user.role !== 'participant') return <Navigate to="/dashboard" />

  return children
}
```

Apply guards to your routes in `App.jsx`:

```jsx
// App.jsx
import { HostRoute } from './components/HostRoute'
import { ParticipantRoute } from './components/ParticipantRoute'

<Routes>
  {/* Public routes */}
  <Route path="/sign-in"     element={<SignIn />} />
  <Route path="/sign-up"     element={<SignUp />} />
  <Route path="/select-role" element={<SelectRole />} />

  {/* Host only routes */}
  <Route path="/dashboard" element={
    <HostRoute><Dashboard /></HostRoute>
  }/>
  <Route path="/problem-bank" element={
    <HostRoute><ProblemBank /></HostRoute>
  }/>
  <Route path="/problems" element={
    <HostRoute><Problems /></HostRoute>
  }/>

  {/* Participant only routes */}
  <Route path="/my-interviews" element={
    <ParticipantRoute><MyInterviews /></ParticipantRoute>
  }/>

  {/* Both roles — interview session page */}
  <Route path="/session/:id" element={<Session />} />
</Routes>
```

---

## 🎤 Step 7 — Interview Page Role Differences

Update the existing `/session/:id` interview page to show different UI per role:

```jsx
// Session.jsx
const { user } = useUser()
const isHost = user?.role === 'host'
const isParticipant = user?.role === 'participant'

return (
  <div className="session-layout">

    {/* Problem header — show for both */}
    <ProblemHeader />

    {/* Time Tracker — HOST ONLY */}
    {isHost && <TimeTracker />}

    {/* Problem navigation tabs — HOST ONLY */}
    {isHost && <ProblemTabs />}

    {/* End Session button — HOST ONLY */}
    {isHost && <EndSessionButton />}

    {/* Next Problem button — HOST ONLY */}
    {isHost && <NextProblemButton />}

    {/* Code Editor — BOTH (but host can edit too) */}
    <CodeEditor readOnly={false} />

    {/* Output panel — BOTH */}
    <OutputPanel />

    {/* Auto Score results — HOST ONLY */}
    {isHost && <AutoScorePanel />}

    {/* Notes panel button — HOST ONLY */}
    {isHost && <NotesButton />}

    {/* Video panel — BOTH */}
    <VideoPanel />

    {/* Chat — BOTH */}
    <ChatPanel />

  </div>
)
```

---

## 🔧 Step 8 — Backend API Changes

Add these new endpoints to your backend:

```javascript
// PATCH /api/users/role
// Save selected role for first-time user
export const updateUserRole = async (req, res) => {
  const { role } = req.body
  const clerkId = req.user.clerkId

  if (!['host', 'participant'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' })
  }

  const user = await prisma.user.update({
    where: { clerkId },
    data: { role }
  })

  return res.json({ success: true, role: user.role })
}

// GET /api/users/me
// Get current logged in user with role
export const getCurrentUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { clerkId: req.user.clerkId }
  })
  return res.json(user)
}

// GET /api/participants/:userId/sessions
// Get all past sessions for a participant
export const getParticipantSessions = async (req, res) => {
  const { userId } = req.params

  const sessions = await prisma.session.findMany({
    where: { participantId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      host: { select: { name: true } }
    }
  })

  return res.json(sessions)
}
```

Register routes:

```javascript
app.patch('/api/users/role',                    requireAuth, updateUserRole)
app.get('/api/users/me',                        requireAuth, getCurrentUser)
app.get('/api/participants/:userId/sessions',   requireAuth, getParticipantSessions)
```

---

## 🎨 Styling Rules

| Element | Rule |
|---------|------|
| Role selection screen background | `#0a0a0a` — same as main bg |
| Role cards default | `bg-[#111111] border border-[#2a2a2a]` |
| Role cards hover | `hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)]` |
| Participant dashboard | Exact same dark theme as host dashboard |
| Stats cards | Same style as existing Active Sessions / Total Sessions cards |
| Decision badges | Move Forward = green, Rejected = red, Pending = yellow |
| Navbar active tab | Same existing green pill style |

---

## ✅ Do NOT Change

- Existing host Dashboard page
- Existing Problem Bank page
- Existing Problems list page
- Existing interview Session page layout
- Existing Navbar styling
- Any existing Prisma models other than adding `role` to User
- Any existing API endpoints
- Clerk authentication setup
