# 🚀 CodeHire - Collaborative Real-Time Coding Platform

CodeHire is a high-performance web application designed for real-time collaborative coding, interview preparation, and teamwork. It combines a powerful code editor, live video calls, and instant messaging into a seamless experience.

![CodeHire Banner](https://img.shields.io/badge/Tech-React%20%7C%20Node.js%20%7C%20PostgreSQL-blue?style=for-the-badge)

## ✨ Key Features

- **� Real-Time Collaborative Editor**: Powered by **Monaco Editor** and **Socket.io**. Experience seamless, Google Docs-style code synchronization with live typing indicators and role-based cursor tracking.
- **🏦 Custom Problem Bank**: Hosts can create, save, and manage their own private library of coding problems. Full CRUD support with custom constraints, examples, and starter code.
- **📹 Live Video Calls**: High-quality integrated video conferencing using **Stream Video SDK** for face-to-face evaluation and communication.
- **💬 Instant Session Chat**: Real-time chat powered by **Stream Chat SDK** to share thoughts, links, and snippets during a coding session.
- **🏃 Live Code Execution**: Run code in JavaScript, Python, and Java with synchronized output viewing for all participants in the room.
- **🧩 Managed Problems**: Access a curated library of built-in DSA problems (Easy, Medium, Hard) to jumpstart your practices.
- **🔐 Secure Identity**: Enterprise-grade user authentication and profile management handled by **Clerk**.
- **🎨 Premium UI/UX**: A state-of-the-art interface built with **Tailwind CSS 4.0** and **DaisyUI**, featuring dark mode, glassmorphism, and smooth page transitions.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Auth**: [Clerk](https://clerk.com/)
- **Real-time Engine**: [Socket.io-client](https://socket.io/) (for editor sync)
- **Communication**: [Stream Video/Chat SDK](https://getstream.io/)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Data Management**: [TanStack Query v5](https://tanstack.com/query/latest)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **WebSocket Server**: [Socket.io](https://socket.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Workflow**: [Inngest](https://www.inngest.com/)
- **Webhooks**: [Svix](https://www.svix.com/)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Cloud instance like Neon/Supabase)
- Clerk account
- Stream account

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
   CLIENT_URL=http://localhost:5173
   ```

   Create a `.env` file in the `FrontEnd` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   VITE_API_URL=http://localhost:3000/api
   VITE_STREAM_API_KEY=your_stream_api_key
   ```

3. **Install Dependencies & Start Development Servers:**

   **Root (Main Command):**
   ```bash
   npm install
   ```

   **BackEnd:**
   ```bash
   cd BackEnd
   npm install
   npm run dev
   ```

   **FrontEnd:**
   ```bash
   cd ../FrontEnd
   npm install
   npm run dev
   ```

## 📜 License
This project is licensed under the [ISC License](LICENSE).

---

Made with ❤️ by [Dhrumil](https://github.com/dhrumilmk06)
