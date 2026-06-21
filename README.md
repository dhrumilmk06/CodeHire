# 🚀 CodeHire - Collaborative Real-Time Coding Platform

CodeHire is a high-performance web application designed for real-time collaborative coding, interview preparation, and teamwork. It combines a powerful code editor, live video calls, and instant messaging into a seamless experience.

![CodeHire Banner](https://img.shields.io/badge/Tech-React%20%7C%20Node.js%20%7C%20PostgreSQL-blue?style=for-the-badge)

## ✨ Key Features

- **⚡ Real-Time Collaborative Editor**: Powered by **Monaco Editor** and **Socket.io**. Experience seamless, Google Docs-style code synchronization with live typing indicators and role-based cursor tracking.
- **🚀 Enhanced Multi-Language support**: Full execution support for **JavaScript, Python, Java, and C++**. High-performance runner with synchronized output and error handling for all session participants.
- **🤖 AI-Powered Interview Coach**: Leverage the **Gemini API** for real-time "AI Hints" for candidates, structured "AI Reviews", and "AI Solutions", providing objective feedback.
- **✨ AI Problem Generator**: Generate unique, tailored coding problems instantly using **Gemini API**, saving hosts hours of manual problem creation.
- **📄 Interview Report Card (PDF)**: Automated generation of professional, stylised PDF reports featuring AI reviews, scoring metrics, and code snapshots, powered by **Puppeteer**.
- **👑 Role-Based Access Control**: Granular permissions featuring distinct experiences for **Admins** (platform monitoring), **Hosts** (interviewer capabilities), and **Participants** (candidate view).
- **📥 Bulk Problem Import**: Import up to 50 problems at once via **JSON**. Features a downloadable template, drag-and-drop UI, real-time validation preview, and multi-language test case support.
- **📁 Comprehensive Problem Bank**: Create a private library or use our built-in curated algorithmic datasets (including LeetCode Hard challenges & Binary Search problems). Supports full CRUD, custom categories, starter code, and **hidden test cases**.
- **⚖️ Candidate Compare Mode**: Advanced host dashboard feature allowing interviewers to view and compare multiple candidate session report cards, code quality, and performance metrics side-by-side.
- **📊 Automated Session Scoring**: Smart scoring logic that evaluates performance based on test case pass rates, code quality, and completion time.
- **⏳ Persistent Timer System**: Advanced state management that preserves elapsed time across page refreshes and problem switches, ensuring zero-loss tracking.
- **🛡️ Enterprise-Grade Security**: Fully hardened endpoints featuring **Rate Limiting**, **XSS Sanitization (DOMPurify)**, JSON depth checks, and atomic **Prisma Transactions** for data integrity.
- **📹 Live Video Calls & Chat**: Integrated high-quality video conferencing and instant messaging powered by **Stream SDK**, keeping the interview focus within the app.
- **🔐 Secure Identity**: Modern authentication handled by **Clerk**, providing seamless onboarding and secure dashboard redirection.
- **🎨 State-of-the-Art UI**: Built with **React** and **Tailwind CSS 4.0**, utilizing highly optimized native CSS keyframes and Intersection Observers to deliver a premium, buttery-smooth dark-mode experience.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) with native CSS Animations, [DaisyUI](https://daisyui.com/), & [Framer Motion](https://www.framer.com/motion/)
- **Auth**: [Clerk](https://clerk.com/)
- **Data Management**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Real-time Engine**: [Socket.io-client](https://socket.io/)
- **Communication**: [Stream Video/Chat SDK](https://getstream.io/)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Execution Engine**: [Piston API](https://github.com/engineer-man/piston) (configured with GCC for C++ support)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/)
- **Reporting**: [Puppeteer](https://pptr.dev/) (Automated PDF generation)
- **Storage**: [Cloudinary](https://cloudinary.com/) (for problem/profile assets)
- **Workflow**: [Inngest](https://www.inngest.com/)
- **Webhooks**: [Svix](https://www.svix.com/)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL instance (Local or Neon/Supabase)
- Clerk, Stream, Cloudinary accounts, and Google Gemini API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dhrumilmk06/CodeHire.git
   cd CodeHire
   ```

2. **Setup Environment Variables:**
   Create a `.env` file in the `BackEnd` directory:
   ```env
   PORT=3000
   DATABASE_URL=your_postgresql_connection_string
   CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   STREAM_API_KEY=your_stream_api_key
   STREAM_SECRET_KEY=your_stream_secret_key
   CLOUDINARY_URL=your_cloudinary_url
   CLIENT_URL=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key
   STITCH_API_KEY=your_stitch_api_key
   ```

   Create a `.env` file in the `FrontEnd` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   VITE_API_URL=http://localhost:3000/api
   VITE_STREAM_API_KEY=your_stream_api_key
   ```

3. **Install Dependencies & Start Development Servers:**

   **Root (Build Script):**
   ```bash
   npm run build
   ```

   **Alternatively, run manually:**
   ```bash
   # Terminal 1: BackEnd
   cd BackEnd && npm install && npm run dev

   # Terminal 2: FrontEnd
   cd FrontEnd && npm install && npm run dev
   ```

## 📁 Project Structure

```
CodeHire/
├── FrontEnd/                    # React 19 + Vite application
│   └── src/
│       ├── api/                 # Axios API call definitions (per feature)
│       ├── components/          # Reusable UI components & widgets
│       ├── context/             # React context providers
│       ├── data/                # Static problem data & seed datasets
│       ├── hooks/               # Custom React hooks
│       ├── layouts/             # Shared layout wrappers (e.g. SessionLayout)
│       ├── lib/                 # Axios instance, utility helpers
│       ├── pages/               # Route-level page components
│       └── App.jsx              # Root router + role-based redirects
│
└── BackEnd/                     # Node.js + Express API server
    ├── prisma/
    │   └── schema.prisma        # PostgreSQL data models (Prisma ORM)
    └── src/
        ├── controllers/         # Business logic handlers
        ├── lib/                 # DB, Socket, Inngest, ENV config
        ├── middleware/          # Auth, error handling, rate limiting
        ├── routes/              # Express route definitions
        ├── schemas/             # Zod/Joi validation schemas
        ├── services/            # AI, PDF, Piston, Agent service abstractions
        ├── utils/               # Shared utilities
        └── server.js            # Entry point — Express + Socket.io setup
```

---

## 🏗️ Architecture & Core Modules

### 1. 🐛 Bug Bounty — Interactive Debugging Challenges
The Bug Bounty feature presents users with **intentionally broken code** and challenges them to find and fix the logic error.

| Step | Action |
|------|--------|
| 1 | User reads the **Bug Report** (description + hints) |
| 2 | User edits the buggy code in the **Monaco Editor** |
| 3 | User runs code against **public test cases** via Piston |
| 4 | User submits — code is evaluated against **hidden test cases** |
| 5 | **Gemini AI** performs a code review (correctness, quality, efficiency) |
| 6 | A **final score** is calculated and a `BugBountySubmission` record is saved |

- Hosts can manage and review submissions from `/host/bug-bounty`.
- A **Leaderboard** aggregates scores across all approved submissions.

### 2. ⚡ Real-Time Collaborative Workspace
The live coding IDE is the core of CodeHire's interview experience.

- **Socket.io** powers all real-time events: code changes, language switches, run output, problem switches, and whiteboard drawing — all synchronized with sub-millisecond latency.
- Rooms are keyed by `callId` (the session ID), ensuring isolation between concurrent interviews.
- An in-memory `roomState` map caches the latest code/output so new joiners immediately sync up.

### 3. 🤖 AI Agent — Automated Interview Monitor
An optional AI agent can be activated by the host during a session. Once active:
- It **monitors candidate code** for stagnation or errors.
- It **auto-generates contextual hints** if the candidate appears stuck.
- It **runs automated test cases** periodically.
- It produces an **agent summary** upon session close, logged to the `Session` record.

### 4. 🎨 System Design Whiteboard
- Powered by **Excalidraw**, embedded directly into the session.
- Whiteboard data is synchronized in real-time using Socket.io's `whiteboard-update` event.
- Hosts can **capture and save snapshots** which are stored as `WhiteboardSnapshot` records in the DB, optionally scored by AI.
- Navigation between the code editor and whiteboard is also synchronized (both participants see the same view).

### 5. 📄 PDF Report Card Generation
At the close of an interview, the host can generate a professional PDF report:
- Powered by **Puppeteer** (headless Chrome).
- Includes: candidate info, AI review, code snapshot, test case pass rate, score, timing, and session notes.
- The generated PDF is saved to the `/reports` directory and served statically.

---

## 🔌 API Reference

The backend exposes the following REST API route groups (all prefixed with `/api`):

| Route Prefix | Description |
|---|---|
| `/api/sessions` | Create, join, and manage interview sessions |
| `/api/problems` | CRUD for the custom problem bank |
| `/api/code` | Code execution via Piston (run & auto-test) |
| `/api/ai` | AI hints, reviews, problem generation, and whiteboard analysis |
| `/api/bug-bounty` | Bug Bounty problems, submissions, hints, leaderboard |
| `/api/reports` | Trigger PDF report card generation |
| `/api/chat` | Stream Chat token provisioning |
| `/api/users` | User profile sync and role management |
| `/api/admin` | Admin-only endpoints (user management, ban/unban) |
| `/api/agent` | Start/stop the AI agent for a session |
| `/api/whiteboard` | Save and retrieve whiteboard snapshots |
| `/api/inngest` | Inngest workflow event handler |

### Key Bug Bounty Endpoints (`/api/bug-bounty`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/problems` | List all problems (paginated, filter by language/difficulty) |
| `GET` | `/problems/:id` | Get a single problem (hidden test cases omitted) |
| `POST` | `/problems/:id/run-tests` | Run code against public test cases |
| `POST` | `/problems/:id/submit` | Final submission — runs hidden tests + AI review |
| `POST` | `/problems/:id/hints` | Retrieve the hint for a problem |
| `GET` | `/problems/:id/solution` | Get the correct solution |
| `POST` | `/problems/:id/explain` | AI explanation of the fix |
| `GET` | `/leaderboard` | Top users by aggregate final score |

---

## 🗄️ Data Models

The database is managed with **Prisma ORM** on **PostgreSQL**. Key models:

| Model | Description |
|---|---|
| `User` | Platform users. Roles: `participant`, `host`, `admin`. Synced with Clerk. |
| `Session` | An interview session record. Links host, participant, problems, code, scores, and AI data. |
| `CustomProblem` | Host-created coding problems with starter code and hidden test cases. |
| `WhiteboardSnapshot` | Saved Excalidraw snapshots with optional AI scoring. |
| `BugBountyProblem` | A debugging challenge with buggy code, bug description, and test cases. |
| `BugBountySubmission` | A user's submission for a Bug Bounty problem with auto-test and AI review results. |
| `BugBountyHintUsed` | Tracks hint usage per submission for scoring penalties. |

---

## 🔗 Socket.io Events

The server handles the following real-time socket events:

| Event | Direction | Description |
|---|---|---|
| `join-room` | Client → Server | Join a session's collaborative room |
| `sync-state` | Server → Client | Send current room state to a new joiner |
| `code-change` | Bidirectional | Broadcast code edits to all room members |
| `language-change` | Bidirectional | Broadcast language selection changes |
| `output-update` | Bidirectional | Broadcast code execution output |
| `problem-change` | Bidirectional | Notify participants of a problem switch |
| `navigate-whiteboard` | Bidirectional | Switch all participants to the whiteboard view |
| `navigate-code` | Bidirectional | Switch all participants back to the code editor |
| `whiteboard-update` | Bidirectional | Broadcast real-time drawing element changes |
| `send-hint` | Host → Participant | Host sends a hint to the candidate |
| `receive-hint` | Server → Participant | Candidate receives the hint |
| `rejoin-session` | Client → Server | Reconnect and re-sync code from the DB |
| `agent:start` | Client → Server | Activate the AI monitoring agent |
| `agent:stop` | Client → Server | Deactivate the AI agent |

---

## 👑 User Roles & Access Control

CodeHire uses **Clerk** for identity management with **role-based access control** enforced at both the frontend route level and backend middleware level.

| Role | Dashboard | Capabilities |
|---|---|---|
| **Admin** | `/admin` | View all users, ban/unban accounts, platform-wide monitoring |
| **Host** | `/dashboard` | Create sessions, manage problem bank, bulk import, compare candidates, generate reports, manage Bug Bounty |
| **Participant** | `/my-interviews` | Join sessions, view past interviews, solve Bug Bounty challenges |

---

## 📜 License
This project is licensed under the [ISC License](LICENSE).

---

Made with ❤️ by [Dhrumil](https://github.com/dhrumilmk06)
