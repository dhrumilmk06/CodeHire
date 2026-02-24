# 🚀 CodeHire - Collaborative Real-Time Coding Platform

CodeHire is a high-performance web application designed for real-time collaborative coding, interview preparation, and teamwork. It combines a powerful code editor, live video calls, and instant messaging into a seamless experience.

![CodeHire Banner](https://img.shields.io/badge/Tech-React%20%7C%20Node.js%20%7C%20MongoDB-blue?style=for-the-badge)

## ✨ Features

- **💻 Collaborative Code Editor**: Powered by **Monaco Editor**, supporting multiple languages (JavaScript, Python, Java) with syntax highlighting.
- **📹 Live Video Calls**: Integrated video conferencing using **Stream Video SDK** for clear real-time communication.
- **💬 Instant Chat**: Built-in chat functionality using **Stream Chat SDK** to discuss problems and share ideas.
- **🧩 Problem Dashboard**: A library of frequently asked DSA problems (Easy, Medium, Hard) to practice and master.
- **🔐 Secure Authentication**: Fast and reliable user authentication handled by **Clerk**.
- **🎨 Modern UI/UX**: Built with **Tailwind CSS** and **DaisyUI** for a sleek, responsive, and premium feel.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Auth**: [Clerk](https://clerk.com/)
- **Real-time**: [Stream Video/Chat SDK](https://getstream.io/)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Workflow**: [Inngest](https://www.inngest.com/)
- **Webhooks**: [Svix](https://www.svix.com/)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
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
   MONGODB_URI=your_mongodb_uri
   CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   STREAM_API_KEY=your_stream_api_key
   STREAM_SECRET_KEY=your_stream_secret_key
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
