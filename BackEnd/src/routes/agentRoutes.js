import express from 'express';
import { prisma } from '../lib/db.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { startAgent, stopAgent, activeAgents } from '../services/agentService.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// POST /api/agent/start
// ---------------------------------------------------------------------------
router.post('/start', protectRoute, async (req, res, next) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ success: false, error: 'sessionId is required' });
        }

        // Verify session exists and belongs to authenticated host
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        if (session.hostId !== req.user.clerkId) {
            return res.status(403).json({ success: false, error: 'Only the host can start the agent' });
        }

        // Check session status
        if (session.status === 'ENDED' || session.status === 'ended') {
            return res.status(400).json({ success: false, error: 'Cannot start agent for ended session' });
        }

        // Call startAgent
        await startAgent(sessionId, req.io);
        req.io.to(`host:${sessionId}`).emit('agent:started', { sessionId, message: 'Agent is now monitoring this session' });

        return res.json({ success: true, message: 'Agent started', agentActive: true });
    } catch (error) {
        next(error);
    }
});

// ---------------------------------------------------------------------------
// POST /api/agent/stop
// ---------------------------------------------------------------------------
router.post('/stop', protectRoute, async (req, res, next) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ success: false, error: 'sessionId is required' });
        }

        // Verify session exists and belongs to authenticated host
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        if (session.hostId !== req.user.clerkId) {
            return res.status(403).json({ success: false, error: 'Only the host can stop the agent' });
        }

        // Call stopAgent
        await stopAgent(sessionId, req.io);
        req.io.to(`host:${sessionId}`).emit('agent:stopped', { sessionId, message: 'Agent has stopped' });

        return res.json({ success: true, message: 'Agent stopped', agentActive: false });
    } catch (error) {
        next(error);
    }
});

// ---------------------------------------------------------------------------
// GET /api/agent/status/:sessionId
// ---------------------------------------------------------------------------
router.get('/status/:sessionId', protectRoute, async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        // Check activeAgents map
        const isRunning = activeAgents.has(sessionId);

        // Fetch Session from DB
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            select: {
                agentActive: true,
                hintsGenerated: true,
                autoTestsRun: true,
                lastAgentCheckAt: true,
                testCasesPassed: true,
            }
        });

        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        return res.json({
            success: true,
            isRunning,
            agentActive: session.agentActive || false,
            hintsGenerated: session.hintsGenerated || 0,
            autoTestsRun: session.autoTestsRun || 0,
            testCasesPassed: session.testCasesPassed || '0/0',
            lastAgentCheckAt: session.lastAgentCheckAt,
        });
    } catch (error) {
        next(error);
    }
});

// ---------------------------------------------------------------------------
// GET /api/agent/summary/:sessionId
// ---------------------------------------------------------------------------
router.get('/summary/:sessionId', protectRoute, async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        // Fetch Session from DB
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            select: {
                agentSummary: true,
                hintsGenerated: true,
                autoTestsRun: true,
                testCasesPassed: true,
            }
        });

        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        return res.json({
            success: true,
            summary: session.agentSummary,
            hintsGenerated: session.hintsGenerated || 0,
            autoTestsRun: session.autoTestsRun || 0,
            testCasesPassed: session.testCasesPassed || '0/0',
        });
    } catch (error) {
        next(error);
    }
});

export default router;
