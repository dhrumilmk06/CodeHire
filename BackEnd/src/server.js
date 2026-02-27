import express from 'express';
import path from "path";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { serve } from 'inngest/express';
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'

import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';
import { functions, inngest } from './lib/inngest.js';

import { fileURLToPath } from "url";
import chatRoutes from './routes/chatRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js'
import problemRoutes from './routes/problemRoutes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);

// ── Socket.io Setup ────────────────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: ENV.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// In-memory store: roomId → { code, language, output }
const roomState = new Map();

io.on("connection", (socket) => {

    // Join a collab room (use session's callId as roomId)
    socket.on("join-room", ({ roomId, userId, role }) => {
        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.userId = userId;
        socket.data.role = role;

        // Send current room state to the new joiner so they're in sync
        if (roomState.has(roomId)) {
            socket.emit("sync-state", roomState.get(roomId));
        }
    });

    // Broadcast code changes to everyone else in the room
    socket.on("code-change", ({ roomId, code, language }) => {
        const state = roomState.get(roomId) || {};
        roomState.set(roomId, { ...state, code, language });
        socket.to(roomId).emit("code-change", { code, language });
    });

    // Broadcast language change
    socket.on("language-change", ({ roomId, language, code }) => {
        const state = roomState.get(roomId) || {};
        roomState.set(roomId, { ...state, language, code });
        socket.to(roomId).emit("language-change", { language, code });
    });

    // Broadcast run-output to all participants in the room
    socket.on("output-update", ({ roomId, output }) => {
        const state = roomState.get(roomId) || {};
        roomState.set(roomId, { ...state, output });
        socket.to(roomId).emit("output-update", { output });
    });

    socket.on("disconnect", () => {
        // Room cleanup is automatic via socket.io
    });
});
// ──────────────────────────────────────────────────────────────────────────

// Middlewares
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }))
app.use(clerkMiddleware())

app.use("/api/inngest", serve({
    client: inngest,
    functions
}))

app.get('/api/health', (req, res) => {
    res.send("Hello World")
})

app.use('/api/chat', chatRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/problems', problemRoutes)

// Deployment: serve built frontend
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../../FrontEnd/dist")));

    app.get(/^(?!\/api).+/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "../../FrontEnd", "dist", "index.html"));
    });
}

const startServer = async () => {
    try {
        await connectDB()
        httpServer.listen(ENV.PORT, () => {
            console.log("Server is running on port:", ENV.PORT)
        });
    } catch (error) {
        console.error("❌Error starting server:", error)
    }
}

startServer();
