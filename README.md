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
- **📁 Custom Problem Bank**: Create and manage a private library of coding problems. Supports full CRUD, custom categories, starter code for multiple languages, and **hidden test cases** for automated evaluation.
- **📊 Automated Session Scoring**: Smart scoring logic that evaluates performance based on test case pass rates, code quality, and completion time.
- **⏳ Persistent Timer System**: Advanced state management that preserves elapsed time across page refreshes and problem switches, ensuring zero-loss tracking.
- **🛡️ Enterprise-Grade Security**: Fully hardened endpoints featuring **Rate Limiting**, **XSS Sanitization (DOMPurify)**, JSON depth checks, and atomic **Prisma Transactions** for data integrity.
- **📹 Live Video Calls & Chat**: Integrated high-quality video conferencing and instant messaging powered by **Stream SDK**, keeping the interview focus within the app.
- **🔐 Secure Identity**: Modern authentication handled by **Clerk**, providing seamless onboarding and secure dashboard redirection.
- **🎨 State-of-the-Art UI**: Built with **Tailwind CSS 4.0**, **DaisyUI**, and **Framer Motion**, delivering a premium dark-mode experience with glassmorphism and smooth animations.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/), [DaisyUI](https://daisyui.com/), & [Framer Motion](https://www.framer.com/motion/)
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

## 📜 License
This project is licensed under the [ISC License](LICENSE).

---

Made with ❤️ by [Dhrumil](https://github.com/dhrumilmk06)
