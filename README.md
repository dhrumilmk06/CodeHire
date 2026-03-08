# 🚀 CodeHire - Collaborative Real-Time Coding Platform

CodeHire is a high-performance web application designed for real-time collaborative coding, interview preparation, and teamwork. It combines a powerful code editor, live video calls, and instant messaging into a seamless experience.

![CodeHire Banner](https://img.shields.io/badge/Tech-React%20%7C%20Node.js%20%7C%20PostgreSQL-blue?style=for-the-badge)

## ✨ Key Features

- **⚡ Real-Time Collaborative Editor**: Powered by **Monaco Editor** and **Socket.io**. Experience seamless, Google Docs-style code synchronization with live typing indicators and role-based cursor tracking.
- **� Multi-Language Code Execution**: Execute code in **JavaScript, Python, Java, and C++** via the **Piston API**, with synchronized output viewing for all participants.
- **�🏦 Custom Problem Bank**: Create, save, and manage your private library of coding problems. Supports full CRUD, custom constraints, starter code, and **hidden test cases** for robust validation.
- **📊 Automated Session Scoring**: Smart scoring logic that evaluates performance based on test case pass rates, code quality, and completion time.
- **⏳ Advanced Timer System**: Persistent session timer that tracks time across page refreshes and problem switches, ensuring accurate evaluation.
- **📹 Live Video Calls**: High-quality integrated video conferencing using **Stream Video SDK** for face-to-face evaluation.
- **💬 Instant Session Chat**: Real-time chat powered by **Stream Chat SDK** to share thoughts and snippets during a session.
- **🔐 Secure Identity**: Enterprise-grade user authentication and profile management handled by **Clerk**, with seamless dashboard redirection.
- **🎨 Premium UI/UX**: State-of-the-art interface built with **Tailwind CSS 4.0**, **DaisyUI**, and **Framer Motion**, featuring glassmorphism and smooth micro-animations.

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
- **Storage**: [Cloudinary](https://cloudinary.com/) (for problem/profile assets)
- **Workflow**: [Inngest](https://www.inngest.com/)
- **Webhooks**: [Svix](https://www.svix.com/)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL instance (Local or Neon/Supabase)
- Clerk, Stream, and Cloudinary accounts

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
