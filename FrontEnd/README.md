# 🚀 CodeHire - FrontEnd

This is the frontend application for **CodeHire**, a real-time collaborative coding and interview platform.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/), [DaisyUI](https://daisyui.com/), [Shadcn UI](https://ui.shadcn.com/), & [Framer Motion](https://www.framer.com/motion/)
- **State Management & Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest), Axios
- **Authentication**: [Clerk](https://clerk.com/)
- **Real-time Collaboration**: [Socket.io-client](https://socket.io/)
- **Communication (Video & Chat)**: [Stream Video/Chat SDK](https://getstream.io/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Whiteboard**: [Excalidraw](https://excalidraw.com/)
- **Animations**: [GSAP](https://gsap.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Valid API keys for Clerk and Stream SDK

### Environment Variables

Create a `.env` file in the `FrontEnd` root directory and configure the following variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000/api
VITE_STREAM_API_KEY=your_stream_api_key
```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 📁 Project Structure

- `src/components/`: Reusable UI elements, modals, and complex platform widgets (like the interview panel).
- `src/api/`: Axios instances and API call definitions for seamless backend integration.
- `src/pages/` / `src/routes/`: Main application views mapped to React Router.
- `public/`: Static assets, SVGs, and global styles.

## ✨ Key Capabilities

- **Real-time Collaborative Code Editor** using Monaco Editor.
- **Integrated Video Conferencing & Chat** utilizing Stream SDK for uninterrupted interviews.
- **Secure Authentication Flow** handled safely via Clerk.
- **Interactive System Design Whiteboard** powered by Excalidraw.
- **Stunning UI** with optimized Tailwind CSS, fluid GSAP animations, and accessible components via Radix UI/Shadcn.

## 📜 License

This project is part of CodeHire and is licensed under the [ISC License](../LICENSE).
