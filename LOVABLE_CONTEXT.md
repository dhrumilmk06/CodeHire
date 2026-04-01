# 🚀 CodeHire: Lovable Project Context

This document provides a comprehensive overview of the **CodeHire** project's architecture, technology stack, and core logic for use with AI development tools like Lovable.

---

## 📂 Project Overview
**CodeHire** is a high-performance, premium web application designed for **real-time collaborative coding**, technical interview preparation, and assessment. It combines a powerful code editor, live video calls, and instant messaging into a seamless experience.

### 🛠️ Core Technology Stack
- **Frontend**: React 19, Tailwind CSS 4.0, DaisyUI, Framer Motion (Animations), Monaco Editor (Core IDE), Stream SDK (Video/Chat), Clerk (Authentication), TanStack Query v5.
- **Backend**: Node.js + Express, PostgreSQL with Prisma ORM, Socket.io (Real-time state sync), Puppeteer (PDF Reporting), Inngest (Background Workflows).
- **AI Integration**: Google Gemini API (Code Hints, Session Reviews, Problem Generation).
- **Core Integrations**:
    - **Code Execution**: Piston API (Multi-language: JS, Python, Java, C++).
    - **Asset Storage**: Cloudinary.
    - **Webhooks**: Svix.

---

## ✨ Key Features & User Roles

### 👥 User Roles
1. **Admin**: Platform management, user moderation (banning/promoting), and system analytics.
2. **Host (Interviewer)**: Creates sessions, manages problem banks, triggers AI hints, evaluates candidates, and generates report cards.
3. **Participant (Candidate)**: Joins sessions via unique codes, solves problems in a collaborative editor, and views their interview history.

### 🚀 Top Features
- **Collaborative IDE**: Google Docs-style real-time code synchronization with live typing indicators and role-based cursor tracking.
- **AI Interview Coach**: Real-time "AI Hint" generation for candidates and "AI Review" (Structured assessment) for hosts.
- **Bulk Problem Import**: UI for importing thousands of lines of coding problems via structured JSON with real-time validation.
- **Interview Report Card**: Automated PDF generation featuring AI reviews, scoring metrics, and code snapshots for professional feedback.
- **Persistent Timer**: Advanced state management that preserves elapsed time across page refreshes and problem switches.

---

## 🏛️ System Architecture

### 📊 Database Schema (Prisma)
- **User**: Stores Clerk IDs, user roles (`admin`, `host`, `participant`), and moderation status.
- **CustomProblem**: Rich JSON fields for problem description, multi-language starter code, and hidden test cases for auto-scoring.
- **Session**: The heart of the app. Tracks session status, shared problem instances, code snapshots, AI reviews, and the final PDF report URL.

### 🗺️ Page & Route Mapping
- `/` : Premium Landing Page with marketing sections.
- `/select-role` : Post-login onboarding to choose between Host and Participant roles.
- `/dashboard` : Host-exclusive panel for active sessions and analytics.
- `/problem-bank` : Management UI for custom problems (Create/Edit/AI Generate).
- `/problems` : Global problem listing for practice.
- `/my-interviews` : Participant-exclusive list of previous and upcoming sessions.
- `/session/:id` : The real-time interview interface featuring collab IDE + Video Call.
- `/admin` : Superuser panel for platform-wide monitoring.

---

## 📡 Real-time & API Logic
- **WebSockets (Socket.io)**: Handles code synchronization, language switching, runner output, and signaling for AI hints.
- **AI Controllers**:
    - `generateCodeHint`: Host-triggered nudge for candidates.
    - `generateCodeReview`: Post-session structured JSON assessment.
    - `generateProblem`: AI-powered creation of unique interview questions.
- **Reporting**: Puppeteer renders an internal HTML template populated with session data and exports it as a stylised PDF to the `/reports/` directory.

---

## 🚀 Getting Started
1. **Root Directory**: `npm install` + `npm run build` (or `npm run dev` in both folders).
2. **BackEnd**: Requires `DATABASE_URL`, `CLERK_SECRET_KEY`, `STREAM_SECRET_KEY`, and `GEMINI_API_KEY`.
3. **FrontEnd**: Requires `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_STREAM_API_KEY`, and `VITE_API_URL`.

---
*Created for automated context injection into Lovable and other AI tools.*
