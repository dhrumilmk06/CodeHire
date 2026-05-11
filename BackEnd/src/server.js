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
import { setIO } from './lib/socket.js';

import { fileURLToPath } from "url";
import chatRoutes from './routes/chatRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js'
import problemRoutes from './routes/problemRoutes.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import codeExecutionRoutes from './routes/codeExecutionRoutes.js'
import agentRoutes from './routes/agentRoutes.js'
import whiteboardRoutes from './routes/whiteboardRoutes.js'
import aiWhiteboardRoutes from './routes/aiWhiteboardRoutes.js'
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);

// ── Socket.io Setup ────────────────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174', ENV.CLIENT_URL],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

setIO(io);

// In-memory store: roomId → { code, language, output }
const roomState = new Map();

io.on("connection", (socket) => {

    // Join a collab room (use session's callId as roomId)
    socket.on("join-room", ({ roomId, userId, role }) => {
        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.userId = userId;
        socket.data.role = role;

        // Join a private room for the user to receive targeted updates (like auto-score)
        socket.join(`user_${userId}`);

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

    // Broadcast problem switch
    socket.on("problem-change", ({ roomId, problemTitle, difficulty }) => {
        socket.to(roomId).emit("problem-change", { problemTitle, difficulty });
    });

    // Broadcast navigation (Whiteboard <-> Code)
    socket.on("navigate-whiteboard", ({ roomId, sessionId }) => {
        socket.to(roomId).emit("navigate-whiteboard", { sessionId });
    });

    socket.on("navigate-code", ({ roomId, sessionId }) => {
        socket.to(roomId).emit("navigate-code", { sessionId });
    });

    // Broadcast real-time whiteboard drawing
    socket.on("whiteboard-update", ({ roomId, elements }) => {
        socket.to(roomId).emit("whiteboard-update", { elements });
    });

    // When host sends a hint
    socket.on('send-hint', ({ roomId, sessionId, hint }) => {
        // Send hint ONLY to candidate in same session room
        socket.to(roomId).emit('receive-hint', { sessionId, hint })
    })

    // Handle reconnection re-join
    socket.on("rejoin-session", async ({ roomId }) => {
        try {
            socket.join(roomId);
            
            // Fetch latest code from DB for this session
            const { prisma } = await import("./lib/db.js");
            const session = await prisma.session.findFirst({
                where: { callId: roomId }
            });

            if (session) {
                const currentCode = session.problemCodes[session.problem] || "";
                socket.emit("session-rejoined", { 
                    code: currentCode
                });
            }
        } catch (error) {
            console.error("[Socket] Rejoin error:", error);
        }
    });

    // ── Agent Orchestration Events ──────────────────────────────────────────

    socket.on('host:join-room', ({ sessionId }) => {
        socket.join(`host:${sessionId}`);
        console.log(`[Socket] Host joined room host:${sessionId}`);
    });

    socket.on('host:leave-room', ({ sessionId }) => {
        socket.leave(`host:${sessionId}`);
    });

    socket.on('agent:start', async ({ sessionId }) => {
        try {
            const { startAgent } = await import('./services/agentService.js');
            await startAgent(sessionId, io);
            socket.emit('agent:started', { sessionId, message: 'Agent is now monitoring this session' });
        } catch (error) {
            console.error('[Socket] agent:start error:', error);
        }
    });

    socket.on('agent:stop', async ({ sessionId }) => {
        try {
            const { stopAgent } = await import('./services/agentService.js');
            await stopAgent(sessionId, io);
            socket.emit('agent:stopped', { sessionId, message: 'Agent has stopped' });
        } catch (error) {
            console.error('[Socket] agent:stop error:', error);
        }
    });

    socket.on("disconnect", () => {
        // Room cleanup is automatic via socket.io
    });
});
// ──────────────────────────────────────────────────────────────────────────

// Middlewares
app.use((req, res, next) => {
    //console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use(express.json({ limit: '10mb' }));
const allowedOrigins = [
    ENV.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
    credentials: true
}))
// Sanitize Authorization header to prevent Clerk JWT parsing crashes (strips quotes, backslashes, and 'null' strings)
app.use((req, res, next) => {
    if (req.headers.authorization) {
        req.headers.authorization = req.headers.authorization
            .replace(/['"\\]/g, '')
            .replace(/^Bearer (null|undefined)$/i, '');
    }
    next();
});

app.use(clerkMiddleware())

// Attach socket.io to req for controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

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
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/code', codeExecutionRoutes)
app.use('/api/agent', agentRoutes)
app.use('/api/whiteboard', whiteboardRoutes)
app.use('/api/ai', aiWhiteboardRoutes)

// Serve reports folder statically
app.use('/reports', express.static('reports'))

app.use(notFoundHandler);
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ERROR ${err.status || 500} - ${req.method} ${req.url} - ${err.message}`);
    if (err.stack) console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});


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
