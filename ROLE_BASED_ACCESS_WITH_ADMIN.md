# 👥 Role-Based Access Control — CodeHire

## Overview

This document covers the complete implementation of **role-based access control** for CodeHire with three distinct roles — **Admin**, **Host (Interviewer)**, and **Participant (Candidate)** — each with their own dashboard, navbar, and feature access.

---

## 🔄 Current vs New Flow

```
CURRENT:
Everyone logs in → Same dashboard → Same features

NEW:
Login
  ↓
Are you a Host or Participant? (one-time selection)
  ↓                    ↓                   ↓
Admin Panel       Host Dashboard    Participant Dashboard
  ↓                    ↓                   ↓
Manage Users      Create Sessions   View Past Interviews
View All Data     Problem Bank      See Feedback
Platform Stats    Compare           Join Session via Link
Ban/Suspend       Notes Panel       View Score History
All Sessions      Time Tracker      See Decision Status
```

---

## 👤 Role Permissions

### Admin (Platform Manager)
```
✅ Access Admin Panel at /admin
✅ View all users — hosts and participants
✅ Change any user's role (host / participant / admin)
✅ Delete any user account
✅ View ALL sessions across entire platform
✅ View ALL custom problems from all hosts
✅ Delete any problem or session
✅ View platform analytics and stats
✅ Ban or suspend any user
✅ Make any custom problem public or private
✅ View total revenue and usage metrics
❌ Cannot be assigned admin role from select-role screen
❌ Admin role is assigned manually in database only
```

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
❌ Cannot access Admin Panel
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
❌ Cannot access Admin Panel
```

---

## ⚠️ CRITICAL WARNING — Read Before Starting

> Running `npx prisma migrate dev` on an existing database with data **WILL wipe all your data** including:
> - All User records
> - All Session records
> - All CustomProblem records
> - All past session notes, scores, and decisions
>
> **Follow the safe migration steps below to add the role field with ZERO data loss.**

---

## 🛡️ Safe Migration Plan — Zero Data Loss

### Before You Do ANYTHING — Backup First

```bash
# Run this in your terminal RIGHT NOW before touching anything
pg_dump -U postgres -d codehire -f codehire_backup.sql

# Verify the backup file was created successfully
# Check your project folder for codehire_backup.sql
# If the file exists and has size > 0 you are safe to proceed
```

---

### Sub-Step 1A — Add Role Column Directly via SQL

Do NOT touch schema.prisma yet. Instead open **pgAdmin**:

```
1. Open pgAdmin
2. Click on CodeHire database
3. Click "Query Tool" (top menu)
4. Paste and run this SQL:
```

```sql
-- Safely adds role column without touching any other table or data
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'participant';
```

This adds the role column directly to the existing User table without recreating it. All existing user data stays intact.

---

### Sub-Step 1B — Set Your Own Account as Admin

After adding the role column immediately set your own account as admin:

```sql
-- Replace with your actual email address
UPDATE "User"
SET "role" = 'admin'
WHERE "email" = 'your-email@gmail.com';
```

Verify it worked:
```sql
SELECT id, email, role FROM "User";
```

---

### Sub-Step 1C — Verify Column Was Added

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'User'
ORDER BY ordinal_position;
```

You should see `role` in the list with default `participant`.

---

### Sub-Step 1D — Update schema.prisma Manually

Now open `prisma/schema.prisma` and ONLY add the role line:

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String?
  role      String   @default("participant") // "admin" | "host" | "participant"
  createdAt DateTime @default(now())
  sessions  Session[] @relation("HostSessions")
}
```

---

### Sub-Step 1E — Generate Prisma Client Only

```bash
# This ONLY regenerates the Prisma client
# Does NOT run any migration
# Does NOT touch your database or data
npx prisma generate
```

---

### ❌ Commands You Must NEVER Run on Existing Data

```bash
❌ npx prisma migrate dev        → WILL wipe data
❌ npx prisma migrate reset      → WILL wipe ALL data
❌ npx prisma db push --force-reset → WILL wipe ALL data
```

---

### ✅ If Data Gets Accidentally Deleted — Restore from Backup

```bash
psql -U postgres -d codehire -f codehire_backup.sql
```

---

## 🗄️ Step 1 — Update Prisma Schema (Safe Version Summary)

```
1. Backup first              → pg_dump -U postgres -d codehire -f codehire_backup.sql
2. Add column via SQL        → ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'participant'
3. Set yourself as admin     → UPDATE "User" SET "role" = 'admin' WHERE "email" = 'your-email@gmail.com'
4. Update schema.prisma      → Add role field manually
5. Generate Prisma client    → npx prisma generate
6. Verify in pgAdmin         → Check User table still has all data
```

---

## 🎯 Step 2 — Role Selection Screen

Create a new page at `/select-role` that appears **only once** on first login.

> **Note:** Admin role is NOT shown on this screen. Admin is assigned manually in the database only. This screen only shows Host and Participant options.

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
- Show this screen ONLY when `user.role` is empty or `participant` (default)
- On card click → call `PATCH /api/users/role` to save role
- After saving → redirect to correct dashboard:
  - Host → `/dashboard`
  - Participant → `/my-interviews`
- Never show this screen again after role is set
- Admin is never redirected here — goes straight to `/admin`

### Styling
- Dark background matching existing CodeHire theme `#0a0a0a`
- Cards use `#111111` background with `#2a2a2a` border
- On hover cards get green border `#22c55e` and lift effect
- Selected card gets solid green border and green glow

---

## 🔀 Step 3 — Role-Based Redirect After Login

```javascript
const user = await prisma.user.findUnique({
  where: { clerkId: userId }
})

// First time login — no role set yet
if (!user || !user.role || user.role === '') {
  redirect('/select-role')
}

// Admin → go to admin panel
if (user.role === 'admin') {
  redirect('/admin')
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

## 🖥️ Step 4 — Three Different Dashboards

### Host Dashboard (existing — no changes)
```
Welcome back, Dhrumil!              [Create Session →]
Active Sessions | Total Sessions | Live Sessions
Your Past Sessions grid
```

### Participant Dashboard (new page /my-interviews)
```
Welcome back, [Name]!               [Join Session →]
Total Interviews | Avg Score | Problems Solved
Your Past Interviews table with scores and decisions
```

### Admin Panel (new page /admin)
```
┌─────────────────────────────────────────────────┐
│  ⚙️ CodeHire Admin Panel                        │
├─────────────┬───────────┬────────────┬──────────┤
│ Total Users │  Hosts    │Participants│ Sessions │
│    150      │    45     │    105     │   320    │
├─────────────┴───────────┴────────────┴──────────┤
│  📊 Tabs:                                       │
│  [Users] [Sessions] [Problems] [Analytics]      │
├─────────────────────────────────────────────────┤
│  USERS TAB:                                     │
│  Search users...                [+ Add User]    │
│  Name | Email | Role | Joined | Status | Action │
│  John | j@... | host | Feb 28 | Active | ⚙️    │
│  Jane | n@... | part | Feb 27 | Active | ⚙️    │
│  Bob  | b@... | part | Feb 26 | Banned | ⚙️    │
├─────────────────────────────────────────────────┤
│  SESSIONS TAB:                                  │
│  All sessions from all hosts                    │
│  Host | Candidate | Problem | Date | Duration   │
├─────────────────────────────────────────────────┤
│  PROBLEMS TAB:                                  │
│  All custom problems from all hosts             │
│  Title | Host | Difficulty | Public | Action    │
├─────────────────────────────────────────────────┤
│  ANALYTICS TAB:                                 │
│  Sessions per day chart                         │
│  Most used problems                             │
│  Most active hosts                              │
└─────────────────────────────────────────────────┘
```

---

## 🧭 Step 5 — Role-Based Navbar

```jsx
export default function Navbar() {
  const { user } = useUser()

  return (
    <nav className="...existing navbar classes...">
      {/* Logo — show for all roles */}
      <Logo />

      {/* Admin navbar */}
      {user?.role === 'admin' && (
        <>
          <NavLink to="/admin">Admin Panel</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/sessions">Sessions</NavLink>
        </>
      )}

      {/* Host navbar */}
      {user?.role === 'host' && (
        <>
          <NavLink to="/problems">Problems</NavLink>
          <NavLink to="/problem-bank">Problem Bank</NavLink>
          <NavLink to="/dashboard">DashBoard</NavLink>
        </>
      )}

      {/* Participant navbar */}
      {user?.role === 'participant' && (
        <>
          <NavLink to="/my-interviews">My Interviews</NavLink>
        </>
      )}

      {/* Avatar — show for all roles */}
      <UserAvatar />
    </nav>
  )
}
```

---

## 🔐 Step 6 — Protected Route Components

```jsx
// components/AdminRoute.jsx
export function AdminRoute({ children }) {
  const { user, isLoaded } = useUser()

  if (!isLoaded) return <LoadingSpinner />
  if (!user) return <Navigate to="/sign-in" />
  if (user.role !== 'admin') return <Navigate to="/dashboard" />

  return children
}

// components/HostRoute.jsx
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

Apply guards in `App.jsx`:

```jsx
<Routes>
  {/* Public routes */}
  <Route path="/sign-in"     element={<SignIn />} />
  <Route path="/sign-up"     element={<SignUp />} />
  <Route path="/select-role" element={<SelectRole />} />

  {/* Admin only routes */}
  <Route path="/admin" element={
    <AdminRoute><AdminPanel /></AdminRoute>
  }/>
  <Route path="/admin/users" element={
    <AdminRoute><AdminUsers /></AdminRoute>
  }/>
  <Route path="/admin/sessions" element={
    <AdminRoute><AdminSessions /></AdminRoute>
  }/>
  <Route path="/admin/problems" element={
    <AdminRoute><AdminProblems /></AdminRoute>
  }/>

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

  {/* Both host and participant */}
  <Route path="/session/:id" element={<Session />} />
</Routes>
```

---

## 🎤 Step 7 — Interview Page Role Differences

```jsx
const { user } = useUser()
const isHost        = user?.role === 'host'
const isParticipant = user?.role === 'participant'

return (
  <div className="session-layout">
    <ProblemHeader />
    {isHost        && <TimeTracker />}
    {isHost        && <ProblemTabs />}
    {isHost        && <EndSessionButton />}
    {isHost        && <NextProblemButton />}
    <CodeEditor />
    <OutputPanel />
    {isHost        && <AutoScorePanel />}
    {isHost        && <NotesButton />}
    <VideoPanel />
    <ChatPanel />
  </div>
)
```

---

## 🔧 Step 8 — Backend API Changes

### Existing APIs (no change needed)
```
All existing session, problem, and user endpoints stay the same
```

### New APIs for Role System

```javascript
// PATCH /api/users/role
// Save selected role for first-time user (host or participant only)
export const updateUserRole = async (req, res) => {
  const { role } = req.body
  const clerkId = req.user.clerkId

  // Admin role cannot be set via this endpoint
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
export const getCurrentUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { clerkId: req.user.clerkId }
  })
  return res.json(user)
}

// GET /api/participants/:userId/sessions
export const getParticipantSessions = async (req, res) => {
  const { userId } = req.params
  const sessions = await prisma.session.findMany({
    where: { participantId: userId },
    orderBy: { createdAt: 'desc' },
    include: { host: { select: { name: true } } }
  })
  return res.json(sessions)
}
```

### New Admin APIs

```javascript
// GET /api/admin/users
// Get all users with pagination
export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 20, search = '' } = req.query

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name:  { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    },
    skip:    (page - 1) * limit,
    take:    parseInt(limit),
    orderBy: { createdAt: 'desc' }
  })

  const total = await prisma.user.count()
  return res.json({ users, total, page, limit })
}

// PATCH /api/admin/users/:userId/role
// Admin changes any user's role
export const changeUserRole = async (req, res) => {
  const { userId } = req.params
  const { role } = req.body

  if (!['admin', 'host', 'participant'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' })
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data:  { role }
  })

  return res.json({ success: true, user })
}

// PATCH /api/admin/users/:userId/ban
// Admin bans or unbans a user
export const toggleBanUser = async (req, res) => {
  const { userId } = req.params
  const { banned } = req.body

  const user = await prisma.user.update({
    where: { id: userId },
    data:  { banned }
  })

  return res.json({ success: true, user })
}

// DELETE /api/admin/users/:userId
// Admin deletes a user
export const deleteUser = async (req, res) => {
  const { userId } = req.params

  await prisma.user.delete({
    where: { id: userId }
  })

  return res.json({ success: true })
}

// GET /api/admin/sessions
// Admin sees all sessions across platform
export const getAllSessions = async (req, res) => {
  const sessions = await prisma.session.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      host: { select: { name: true, email: true } }
    }
  })
  return res.json(sessions)
}

// GET /api/admin/problems
// Admin sees all custom problems across platform
export const getAllProblems = async (req, res) => {
  const problems = await prisma.customProblem.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return res.json(problems)
}

// GET /api/admin/analytics
// Platform stats for admin dashboard
export const getAnalytics = async (req, res) => {
  const totalUsers        = await prisma.user.count()
  const totalHosts        = await prisma.user.count({ where: { role: 'host' } })
  const totalParticipants = await prisma.user.count({ where: { role: 'participant' } })
  const totalSessions     = await prisma.session.count()
  const totalProblems     = await prisma.customProblem.count()

  return res.json({
    totalUsers,
    totalHosts,
    totalParticipants,
    totalSessions,
    totalProblems
  })
}
```

Register admin routes with admin middleware:

```javascript
// Regular user routes
app.patch('/api/users/role',                  requireAuth,              updateUserRole)
app.get('/api/users/me',                      requireAuth,              getCurrentUser)
app.get('/api/participants/:userId/sessions', requireAuth,              getParticipantSessions)

// Admin only routes — protected by requireAdmin middleware
app.get('/api/admin/users',                   requireAuth, requireAdmin, getAllUsers)
app.patch('/api/admin/users/:userId/role',    requireAuth, requireAdmin, changeUserRole)
app.patch('/api/admin/users/:userId/ban',     requireAuth, requireAdmin, toggleBanUser)
app.delete('/api/admin/users/:userId',        requireAuth, requireAdmin, deleteUser)
app.get('/api/admin/sessions',                requireAuth, requireAdmin, getAllSessions)
app.get('/api/admin/problems',                requireAuth, requireAdmin, getAllProblems)
app.get('/api/admin/analytics',               requireAuth, requireAdmin, getAnalytics)
```

### requireAdmin Middleware

```javascript
export function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden. Admin access required'
    })
  }
  next()
}
```

---

## 🗄️ Update Prisma Schema for Ban Support

Add `banned` field to User model safely via SQL first:

```sql
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "banned" BOOLEAN NOT NULL DEFAULT false;
```

Then update `schema.prisma`:

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String?
  role      String   @default("participant")
  banned    Boolean  @default(false)
  createdAt DateTime @default(now())
  sessions  Session[] @relation("HostSessions")
}
```

Then run:
```bash
npx prisma generate
```

---

## 🎨 Styling Rules

| Element | Rule |
|---------|------|
| Admin panel background | `#0a0a0a` same as main bg |
| Admin stat cards | Same dark card style as existing dashboard |
| Admin table rows | Dark background `#111111` with `#2a2a2a` border |
| Admin table hover | `hover:bg-[#1a1a1a]` subtle highlight |
| Role badge — Admin | Purple `bg-purple-500` |
| Role badge — Host | Green `bg-green-500` |
| Role badge — Participant | Blue `bg-blue-500` |
| Status badge — Active | Green `bg-green-500` |
| Status badge — Banned | Red `bg-red-500` |
| Role selection screen | `#0a0a0a` background, green hover cards |
| Participant dashboard | Exact same dark theme as host dashboard |
| Decision badges | Move Forward = green, Rejected = red, Pending = yellow |

---

## ✅ Do NOT Change

- Existing host Dashboard page
- Existing Problem Bank page
- Existing Problems list page
- Existing interview Session page layout
- Existing Navbar styling
- Any existing session, problem, or auth API endpoints
- Clerk authentication setup
- Any existing Prisma models except adding role and banned to User
