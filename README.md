# 🚀 CodeHire — Real-Time Collaborative Technical Interview Platform & AI Engineering Suite

CodeHire is an enterprise-ready, full-stack collaborative platform purpose-built for modern technical interviews, live pair programming, and interactive developer assessments. It unites a real-time synchronized code editor, low-latency video and chat conferencing, an Excalidraw system design whiteboard, autonomous AI interview coaches, an interactive Bug Bounty debugging arena, automated Puppeteer PDF report cards, and transactional decision email notifications into one cohesive workflow.

![CodeHire Banner](https://img.shields.io/badge/CodeHire-Technical%20Interview%20Platform-00ff9d?style=for-the-badge&logo=codeforces&logoColor=black)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express 5](https://img.shields.io/badge/Express-5.1-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![Clerk Auth](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com/)
[![Google Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Stream SDK](https://img.shields.io/badge/Stream-Video_%26_Chat-005FFF?style=flat-square&logo=stream&logoColor=white)](https://getstream.io/)
[![Resend](https://img.shields.io/badge/Resend-Email_API-000000?style=flat-square&logo=resend&logoColor=white)](https://resend.com/)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-PDF_Generation-40B5A4?style=flat-square&logo=puppeteer&logoColor=white)](https://pptr.dev/)

---

## 🌟 Key Features

### ⚡ Collaborative Real-Time Workspace
- **Monaco Code Editor**: Full syntax highlighting, intelligent autocomplete, bracket matching, and theme customization.
- **Sub-Millisecond Synchronization**: Socket.io event engine broadcasts character-by-character edits, live cursor states, and typing indicators.
- **Synchronized State**: Instant room-wide language switches, active problem changes, and execution output broadcast to both host and candidate.
- **Auto-Reconnection & Recovery**: In-memory `roomState` caching and database fallbacks seamlessly restore session code and timers across network drops or page reloads.

### 🎯 Diverse Interview Modes
- **💻 Coding Interview**: Live multi-language code execution against custom and hidden test suites with automated pass/fail analytics.
- **🎨 System Design Whiteboard**: Embedded **Excalidraw** whiteboard with bidirectional real-time drawing sync, snapshot persistence, and AI-powered architectural review.
- **🐛 Bug Bounty Arena**: Gamified challenge mode featuring intentionally buggy programs across multiple languages. Users fix bugs, run public tests, and submit against hidden tests with hints scoring penalties and leaderboards.

### 🤖 Multi-Tier AI Intelligence (Google Gemini)
- **💡 Real-Time AI Code Hints**: Host-controlled or autonomous glowing suggestions sent directly into the candidate's editor without spoiling the solution.
- **📝 Automated Code Reviews**: Rigorous post-execution evaluations analyzing correctness, time complexity, space complexity, code smell, and design patterns.
- **✨ AI Problem Generator**: Instantly generates rich problem descriptions, examples, constraints, starter code, and test cases with one click.
- **📐 AI Whiteboard Architect**: Vision-enabled review of Excalidraw system design diagrams, scoring scalability, modularity, and trade-offs.
- **🤖 Autonomous Monitoring Agent**: Background agent that tracks candidate stagnation, periodically runs test suites, provides nudges, and drafts an executive session summary.

### ⚙️ Multi-Engine Execution Architecture
- **Dual Execution Engine Support**: Seamlessly switch between **Piston API** and **Judge0 CE** (`CODE_EXECUTOR=judge0`) for isolated, sandbox code execution.
- **Multi-Language Support**: Complete compilation and runtime execution for **JavaScript (Node.js), Python 3, Java, C++ (GCC), TypeScript, and C**.

### 📄 Automated Interview Report Cards & Decision Emails
- **Puppeteer PDF Generation**: Generates high-fidelity, branded PDF interview report cards containing candidate details, host notes, scoring breakdowns, code snapshots, and Gemini AI evaluations.
- **Resend Decision Notifications**: Send automated, beautifully formatted dark-mode decision emails (Offer, Next Round, Rejection) directly to candidates with customizable notes.

### 📥 Enterprise Problem Bank & Hardened Bulk Import
- **Curated Standard Problems**: Integrated catalog of algorithmic challenges categorized by topic and difficulty level.
- **Custom Problem Builder**: Full CRUD support for host-authored problems with custom starter templates, public test cases, and hidden validation suites.
- **10-Tier Hardened JSON Importer**: Drag-and-drop bulk problem ingestion fortified with:
  1. JSON file type & MIME validation
  2. 1MB strict payload size limit
  3. Max 50 problems per import batch
  4. JSON depth limiting against nested DOS attacks
  5. Mandatory schema & field integrity verification
  6. Multi-language starter code & test case structure checks
  7. XSS sanitization via DOMPurify
  8. Dedicated per-user rate limiting (5 imports / hour)
  9. Duplicate title conflict detection
  10. Atomic Prisma transaction rollbacks

### 🔑 Participant Dashboard & Quick Join
- **Frictionless Onboarding**: Candidates can paste a direct session link or enter a concise 6-character short code (`ABC-XYZ`) directly from their dashboard.
- **Rate-Limited Join Guard**: Protected against brute-force code guessing with IP and account rate limiting.

### 👑 3-Tier Role-Based Access Control (RBAC)
- **Admin**: Platform oversight, user account management, suspension/banning, global session monitoring, and system metrics.
- **Host (Interviewer)**: Session creation, problem bank management, bulk import, candidate side-by-side comparison, live scoring, report card generation, and hiring decision dispatches.
- **Participant (Candidate)**: Clean, focused portal for active and past interview sessions, feedback reviews, Bug Bounty practice, and leaderboards.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | `^19.2.0` | Declarative component UI library |
| **Vite** | `^7.2.4` | High-speed frontend build tool & dev server |
| **Tailwind CSS** | `^4.1.18` | Modern utility-first styling engine |
| **DaisyUI** | `^5.5.14` | Component UI primitives |
| **Framer Motion** | `^12.34.3` | Fluid UI layout animations and page transitions |
| **GSAP** | `^3.14.2` | High-performance hero animations |
| **Monaco Editor** | `^4.7.0` | VS Code-grade in-browser code editor |
| **Excalidraw** | `^0.18.1` | Real-time collaborative system design canvas |
| **Stream Video & Chat SDK** | `^1.24.0` / `^9.23.0` | Low-latency audio/video calling and chat |
| **Clerk React** | `^5.59.6` | User authentication and session management |
| **TanStack Query** | `^5.90.5` | Asynchronous server-state management and caching |
| **Socket.io Client** | `^4.8.3` | Real-time WebSocket event communication |
| **Axios** | `^1.12.2` | HTTP client with automatic auth token interceptors |
| **React Resizable Panels** | `^3.0.6` | Adjustable multi-pane IDE layout |
| **Lucide React** | `^0.563.0` | Icon system |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | `>=18.0.0` | Server runtime environment |
| **Express.js** | `^5.1.0` | Next-generation REST API framework |
| **PostgreSQL** | `>=15.0` | Relational primary database |
| **Prisma ORM** | `^6.4.1` | Type-safe database client and migrations |
| **Socket.io** | `^4.8.3` | Real-time bidirectional WebSocket server |
| **Google Generative AI** | `^0.24.1` | Gemini 2.5 Flash SDK for code hints, reviews & scoring |
| **Puppeteer** | `^24.40.0` | Headless Chrome engine for automated PDF report generation |
| **Resend** | `^6.12.3` | Transactional email delivery for interview decisions |
| **Clerk Express** | `^1.7.41` | JWT authentication and identity middleware |
| **Stream Node SDK** | `^0.7.12` | Video call token provisioning and room orchestration |
| **Piston / Judge0 CE** | REST APIs | Isolated sandbox code execution engines |
| **Inngest** | `^3.44.3` | Event-driven background jobs and workflows |
| **Helmet & Express Rate Limit** | `^8.3.0` / `^8.3.1` | HTTP security headers and endpoint rate limiting |
| **Zod** | `^4.4.3` | Runtime schema validation and request sanitation |

---

## 📁 Directory Structure

```
CodeHire/
├── FrontEnd/                         # React 19 + Vite Frontend Application
│   ├── public/                       # Static public assets
│   └── src/
│       ├── api/                      # Modular Axios API service definitions
│       │   ├── bugBounty.js          # Bug Bounty API operations
│       │   ├── sessions.js           # Session and notes endpoints
│       │   └── standardProblems.js   # Standard problem catalog calls
│       ├── components/               # Reusable UI components
│       │   ├── Navbar.jsx            # Dynamic role-aware navigation bar
│       │   ├── CodeEditor.jsx        # Monaco Editor wrapper with cursor tracking
│       │   ├── OutputPanel.jsx       # Real-time execution output & test results
│       │   ├── Whiteboard.jsx        # Excalidraw integration & snapshot triggers
│       │   ├── RoleRoutes.jsx        # Route guards (Admin, Host, Participant)
│       │   └── BulkImportModal.jsx   # 10-tier secured JSON bulk problem importer
│       ├── context/                  # React context providers
│       ├── data/                     # Seed datasets and problem categories
│       ├── hooks/                    # Custom React hooks (sockets, timers, stream)
│       ├── layouts/                  # Layout wrappers (SessionLayout, DashboardLayout)
│       ├── lib/                      # Axios client, Clerk config, utils
│       ├── pages/                    # Application pages
│       │   ├── LandingPage.jsx       # High-converting landing page
│       │   ├── DashBoardPage.jsx     # Host interview orchestration dashboard
│       │   ├── SessionPage.jsx       # Collaborative IDE & video interview room
│       │   ├── WhiteboardPage.jsx    # Fullscreen collaborative system design room
│       │   ├── MyInterviewsPage.jsx  # Participant dashboard & quick join modal
│       │   ├── ProblemBankPage.jsx   # Host problem management & bulk import
│       │   ├── AdminPanelPage.jsx    # System administration & user controls
│       │   ├── BugBountyList.jsx     # Bug bounty challenge index & filters
│       │   ├── BugBountyProblem.jsx  # Bug bounty candidate solving IDE
│       │   └── BugBountyReview.jsx   # Host manual submission grading panel
│       └── App.jsx                   # Central router & role redirection logic
│
├── BackEnd/                          # Node.js + Express 5 Backend API Server
│   ├── prisma/
│   │   └── schema.prisma             # PostgreSQL schema definition & indexes
│   ├── reports/                      # Statically served Puppeteer generated PDFs
│   └── src/
│       ├── controllers/              # Request controllers & business logic
│       │   ├── sessionController.js  # Sessions, timings, notes, decision emails
│       │   ├── problemController.js  # Problem CRUD, title search, bulk import
│       │   ├── bugBounty.js          # Bug bounty submissions, grading & leaderboard
│       │   ├── adminController.js    # User management, bans, global metrics
│       │   ├── aiController.js       # Gemini hints, reviews, problem generation
│       │   └── reportController.js   # Puppeteer PDF generation handler
│       ├── middleware/               # Express middleware
│       │   ├── protectRoute.js       # Clerk JWT verification & user auto-sync
│       │   ├── requireAdmin.js       # Admin role validation guard
│       │   ├── validate.js           # Zod payload validation middleware
│       │   └── errorHandler.js       # Centralized error & 404 handlers
│       ├── routes/                   # REST API routes
│       │   ├── sessionRoutes.js      # /api/sessions
│       │   ├── problemRoutes.js      # /api/problems
│       │   ├── standardProblemRoutes.js # /api/standard-problems
│       │   ├── bugBounty.js          # /api/bug-bounty
│       │   ├── aiRoutes.js           # /api/ai
│       │   ├── reportRoutes.js       # /api/reports
│       │   ├── codeExecutionRoutes.js# /api/code
│       │   ├── agentRoutes.js        # /api/agent
│       │   ├── whiteboardRoutes.js   # /api/whiteboard
│       │   └── adminRoutes.js        # /api/admin
│       ├── schemas/                  # Zod request validation schemas
│       ├── services/                 # External service adapters
│       │   ├── pistonService.js      # Piston code runner adapter
│       │   ├── judge0Service.js      # Judge0 CE runner adapter
│       │   ├── agentService.js       # Autonomous AI session monitoring agent
│       │   ├── geminiReviewService.js# Gemini AI code reviewer
│       │   └── pdfService.js         # Headless Chrome PDF report generator
│       ├── utils/                    # Helper utilities & email templates
│       │   ├── sendDecisionEmail.js  # Resend dark-mode decision email builder
│       │   └── sessionHelpers.js     # 6-character code generator & URL parsers
│       └── server.js                 # HTTP server, Socket.io setup, Express pipeline
│
└── package.json                      # Workspace root scripts & shared tooling
```

---

## 🏗️ Architecture & Core Workflows

### 1. Collaborative Real-Time Coding Flow
```mermaid
sequenceDiagram
    autonumber
    actor Host as Host (Interviewer)
    actor Candidate as Candidate (Participant)
    participant Socket as Socket.io Server
    participant Exec as Runner (Piston / Judge0)
    participant Gemini as Google Gemini API

    Host->>Socket: join-room (roomId = callId)
    Candidate->>Socket: join-room (roomId = callId)
    Socket-->>Candidate: sync-state (cached code, language, problem)
    Candidate->>Socket: code-change (broadcast delta)
    Socket-->>Host: code-change (live sync to editor)
    Host->>Socket: send-hint (AI-generated)
    Socket-->>Candidate: receive-hint (glowing hint banner)
    Candidate->>Exec: Run Code (code, language, public tests)
    Exec-->>Socket: output-update (test results)
    Socket-->>Host: output-update (synchronized output panel)
    Host->>Gemini: End Session & Request AI Review
    Gemini-->>Host: Complexity analysis, score & feedback
```

### 2. Bug Bounty Challenge Workflow
```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│  Select Broken Code    │ ──>  │  Interactive Debugging │ ──>  │  Public Test Validation│
│  Difficulty & Points   │      │  Monaco Editor Fix     │      │  Piston / Judge0 Run   │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
                                                                            │
┌────────────────────────┐      ┌────────────────────────┐                 ▼
│  Global Leaderboard &  │ <──  │  Score Calculation &   │ <──  ┌────────────────────────┐
│  Host Manual Review    │      │  Gemini AI Review      │      │  Final Submission      │
│  Points Awarded        │      │  Hint Deductions       │      │  Hidden Test Suites    │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

### 3. Automated Decision Email Flow (Resend)
```
Host Ends Session ──> Clicks "Send Decision" ──> Selects Status:
                                                  ├── Offer Extended
                                                  ├── Next Round Interview
                                                  └── Candidate Rejected
                                                           │
                                                           ▼
                             Resend API renders responsive dark-mode HTML email:
                             - Candidate Name & Position
                             - Branded Decision Badge
                             - Custom Host Notes & Feedback
                             - Immediate Delivery to Candidate Inbox
```

---

## 🔌 API Reference

All backend routes are mounted under the `/api` prefix and require Clerk JWT Bearer authorization unless specifically noted.

### Route Groups
| Endpoint Prefix | Description | Auth Requirement |
|---|---|---|
| `/api/sessions` | Session lifecycle, quick-join, live notes, timings, decisions | Authenticated User |
| `/api/problems` | Host custom problem bank CRUD, title search, bulk import | Authenticated Host / Admin |
| `/api/standard-problems` | Global algorithmic standard problems catalog | Public / Authenticated |
| `/api/code` | Multi-language code execution and hint verification | Authenticated User |
| `/api/ai` | Gemini hints, code reviews, problem generator, whiteboard reviewer | Authenticated User |
| `/api/bug-bounty` | Bug bounty problems, hint penalties, test runner, leaderboard | Authenticated User |
| `/api/reports` | Puppeteer server-side interview report card PDF generation | Authenticated Host / Admin |
| `/api/admin` | User management, account ban toggles, platform telemetry | Admin Only |
| `/api/agent` | Autonomous AI interview monitor start/stop/status/summary | Authenticated Host |
| `/api/whiteboard` | Excalidraw diagram snapshots and AI architecture scoring | Authenticated User |
| `/api/chat` | Stream Chat user token generation | Authenticated User |
| `/api/inngest` | Inngest background event processing handler | Inngest Webhook Signature |

### Selected Key Endpoints

#### Session Management (`/api/sessions`)
- `POST /api/sessions`: Create a new session (`sessionType`: `'coding' | 'system-design' | 'bug_bounty'`).
- `POST /api/sessions/join`: Join a session via 6-character code or full URL (Rate-limited).
- `GET /api/sessions/:id`: Retrieve session metadata, problems, participants, and timings.
- `POST /api/sessions/:id/notes`: Save private interviewer notes.
- `PATCH /api/sessions/:id/decision`: Set candidate hiring status (`accepted`, `rejected`, `next-round`).
- `POST /api/sessions/:id/decision`: Dispatch branded decision notification email via Resend.
- `POST /api/sessions/:id/end`: End the active session and finalize timing records.

#### Problem Bank & Bulk Import (`/api/problems`)
- `GET /api/problems`: Fetch all problems created by the authenticated host.
- `POST /api/problems`: Create a new problem with starter code and hidden test cases.
- `POST /api/problems/bulk`: Ingest up to 50 problems via JSON (Protected by 10 security checks & rate limiting).
- `PUT /api/problems/:id`: Update existing custom problem definition.
- `DELETE /api/problems/:id`: Delete a custom problem.

#### Bug Bounty Debugging (`/api/bug-bounty`)
- `GET /api/bug-bounty/problems`: Paginated list of debugging challenges with language/difficulty filters.
- `GET /api/bug-bounty/problems/:id`: Problem details (buggy code and public test cases; hidden tests omitted).
- `POST /api/bug-bounty/problems/:id/run-tests`: Run code against public test cases.
- `POST /api/bug-bounty/problems/:id/submit`: Evaluate code against hidden tests and trigger Gemini review.
- `POST /api/bug-bounty/problems/:id/hints`: Reveal hints (records penalty on final score).
- `GET /api/bug-bounty/leaderboard`: Fetch global leaderboard ordered by cumulative score.

#### Administrative Operations (`/api/admin`)
- `GET /api/admin/users`: List all platform users with roles and status.
- `PATCH /api/admin/users/:userId/role`: Change user role (`admin`, `host`, `participant`).
- `PATCH /api/admin/users/:userId/ban`: Suspend or reinstate user access.
- `DELETE /api/admin/users/:userId`: Permanently purge user profile.
- `GET /api/admin/sessions`: List all platform-wide interview sessions.
- `GET /api/admin/analytics`: Return platform usage stats, session counts, and user distribution.

---

## 🔗 Socket.io Real-Time Events

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `join-room` | Client → Server | `{ roomId, userId, role }` | Joins session room and personal notification channel |
| `sync-state` | Server → Client | `{ code, language, output }` | Dispatches cached room state to newly connected client |
| `code-change` | Bidirectional | `{ roomId, code, language }` | Synchronizes Monaco editor buffer across all peers |
| `language-change` | Bidirectional | `{ roomId, language, code }` | Switches active editor language for all room participants |
| `output-update` | Bidirectional | `{ roomId, output }` | Broadcasts code execution results and test diagnostics |
| `problem-change` | Bidirectional | `{ roomId, problemTitle, difficulty }` | Notifies peers of problem switch |
| `navigate-whiteboard` | Bidirectional | `{ roomId, sessionId }` | Synchronously transitions all participants to the whiteboard |
| `navigate-code` | Bidirectional | `{ roomId, sessionId }` | Synchronously transitions all participants back to code editor |
| `whiteboard-update` | Bidirectional | `{ roomId, elements }` | Streams real-time Excalidraw drawing canvas mutations |
| `send-hint` | Host → Server | `{ roomId, sessionId, hint }` | Host dispatches a Gemini AI hint to the candidate |
| `receive-hint` | Server → Candidate | `{ sessionId, hint }` | Delivers glowing hint banner to the candidate's IDE |
| `rejoin-session` | Client → Server | `{ roomId }` | Requests code recovery from database upon reconnect |
| `session-rejoined` | Server → Client | `{ code }` | Returns latest persisted database code snapshot |
| `agent:start` | Host → Server | `{ sessionId }` | Activates background autonomous AI monitoring agent |
| `agent:stop` | Host → Server | `{ sessionId }` | Terminates background monitoring agent |
| `agent:started` | Server → Host | `{ sessionId, message }` | Emitted when agent begins active observation |
| `agent:stopped` | Server → Host | `{ sessionId, message }` | Emitted when agent ends active observation |

---

## 🗄️ Database Architecture (Prisma & PostgreSQL)

```
┌────────────────┐          ┌──────────────────────┐          ┌───────────────────────┐
│      User      │ 1      * │       Session        │ 1      * │  WhiteboardSnapshot   │
│────────────────│──────────│──────────────────────│──────────│───────────────────────│
│ id (cuid)      │          │ id (cuid)            │          │ id (uuid)             │
│ clerkId (UQ)   │          │ session_code (UQ)    │          │ sessionId (FK)        │
│ email (UQ)     │          │ hostId (FK -> User)  │          │ imageData (base64)    │
│ role           │          │ participantClerkId   │          │ excalidrawData (json) │
│ banned         │          │ problemCodes (json)  │          │ aiScore / aiFeedback  │
└────────────────┘          │ sessionType          │          └───────────────────────┘
                            │ decisionStatus       │
                            └──────────────────────┘
                                        │ 1
                                        │
                                        │ *
                            ┌──────────────────────┐          ┌───────────────────────┐
                            │ BugBountySubmission  │ *      1 │   BugBountyProblem    │
                            │──────────────────────│──────────│───────────────────────│
                            │ id (autoincrement)   │          │ id (autoincrement)    │
                            │ problemId (FK)       │          │ title / language      │
                            │ sessionId (FK)       │          │ buggyCode / hints     │
                            │ finalScore           │          │ hiddenTestCases       │
                            │ autoTestResult (json)│          │ bountyPoints          │
                            └──────────────────────┘          └───────────────────────┘
```

### Models Overview
- **`User`**: Core user accounts synced from Clerk. Manages platform roles (`admin`, `host`, `participant`) and account moderation flags.
- **`Session`**: The foundational interview record. Tracks code for multiple problems, timers, host notes, tags, auto-scores, report status, and decision states.
- **`CustomProblem`**: Host-authored problems with starter boilerplate, markdown descriptions, constraints, and hidden test suites.
- **`StandardProblem`**: System-curated algorithmic challenge library.
- **`WhiteboardSnapshot`**: Stored Excalidraw diagrams with optional AI design score and feedback.
- **`BugBountyProblem`**: Debugging challenges containing intentionally defective code, test cases, and difficulty metrics.
- **`BugBountySubmission`**: Candidate solutions graded against hidden test cases with AI reviews and hint penalties.
- **`BugBountyHintUsed`**: Audit log of hints viewed during a bug bounty challenge to calculate score deductions.

---

## 👑 Role-Based Access Matrix

| Feature / Capability | Admin | Host (Interviewer) | Participant (Candidate) |
|---|:---:|:---:|:---:|
| **Landing & Public Problems** | ✅ | ✅ | ✅ |
| **Participant Quick-Join (Code & Link)** | ✅ | ✅ | ✅ |
| **Solve Bug Bounty Challenges** | ✅ | ✅ | ✅ |
| **View Global Leaderboard** | ✅ | ✅ | ✅ |
| **Create & Host Live Sessions** | ✅ | ✅ | ❌ |
| **Collaborative Whiteboard Drawing** | ✅ | ✅ | ✅ |
| **Trigger AI Code Hints & Reviews** | ✅ | ✅ | ❌ |
| **Start Autonomous AI Agent** | ✅ | ✅ | ❌ |
| **Problem Bank CRUD & Bulk JSON Import** | ✅ | ✅ | ❌ |
| **Compare Candidates Side-by-Side** | ✅ | ✅ | ❌ |
| **Generate Puppeteer PDF Report Cards** | ✅ | ✅ | ❌ |
| **Dispatch Resend Decision Emails** | ✅ | ✅ | ❌ |
| **Review & Grade Bug Bounty Submissions** | ✅ | ✅ | ❌ |
| **Platform-Wide User & Session Moderation** | ✅ | ❌ | ❌ |
| **Ban / Unban Accounts & Elevate Roles** | ✅ | ❌ | ❌ |
| **System Analytics & Audit Metrics** | ✅ | ❌ | ❌ |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) database instance (Local, Neon, Supabase, or AWS RDS)
- [Clerk Account](https://clerk.com/) (Authentication)
- [Stream Account](https://getstream.io/) (Video & Chat SDKs)
- [Google AI Studio Account](https://aistudio.google.com/) (Gemini API Key)
- [Resend Account](https://resend.com/) (Transactional Email API)

---

### Step 1: Clone Repository
```bash
git clone https://github.com/dhrumilmk06/CodeHire.git
cd CodeHire
```

---

### Step 2: Configure Environment Variables

#### Backend Configuration
Create `BackEnd/.env`:
```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/codehire_db?schema=public"

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# Stream Video & Chat
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Resend Email Delivery
RESEND_API_KEY=re_your_resend_api_key
# Optional: Route sandbox emails to a verified address during development
DEV_EMAIL_OVERRIDE=your_email@domain.com

# Code Execution Engine (Default: piston. Set to 'judge0' for Judge0 CE)
CODE_EXECUTOR=judge0
JUDGE0_BASE_URL=https://ce.judge0.com

# Inngest Background Jobs (Optional)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

#### Frontend Configuration
Create `FrontEnd/.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key

# Optional: Code execution engine flag
# VITE_CODE_EXECUTOR=judge0
```

---

### Step 3: Install Dependencies & Setup Database

#### 1. Setup Prisma Database Schema
```bash
cd BackEnd
npm install
npx prisma generate
npx prisma db push
```

#### 2. Install Frontend Dependencies
```bash
cd ../FrontEnd
npm install
```

---

### Step 4: Run Development Servers

Open two terminal sessions:

```bash
# Terminal 1: Start Express & Socket.io Backend
cd BackEnd
npm run dev
# Server running at http://localhost:3000
```

```bash
# Terminal 2: Start Vite React Frontend
cd FrontEnd
npm run dev
# Application running at http://localhost:5173
```

---

## 🔒 Security Best Practices Implemented

- **Helmet Protection**: Automatic HTTP security header hardening against clickjacking, MIME-sniffing, and cross-site leaks.
- **Clerk Header Sanitization**: Regex sanitizer cleanses incoming `Authorization` headers to prevent null token and escape character crashes.
- **Rate-Limiting Shields**:
  - Global API limiter: 100 requests per 15-minute window per IP.
  - Session quick-join limiter: Protects short code endpoint against brute-force attempts.
  - Bulk problem import limiter: 5 uploads per hour enforced per authenticated user ID.
- **Payload & File Controls**: Strict 2MB Express JSON parsing limit and 1MB bulk JSON file size restriction.
- **Deep JSON Defenses**: Algorithmic depth validation blocks nested JSON recursion Denial of Service (DoS) attacks.
- **XSS Scrubbing**: Client-side and server-side sanitization via **DOMPurify** before persisting descriptions and notes.
- **Transactional Safety**: Atomic Prisma multi-model operations guarantee zero orphaned records upon import or submission errors.

---

## 📄 License
This project is licensed under the [ISC License](LICENSE).

---

## 👨‍💻 Author
Crafted with passion by **[Dhrumil](https://github.com/dhrumilmk06)**. Contributions and feature suggestions are always welcome!
