import { prisma } from "../lib/db.js";
import { chatClient, streamClient } from "../lib/stream.js";
import { mapId, getFileExecution } from "../lib/utils.js";
import { inngest } from "../lib/inngest.js";
import { emitToRoom } from "../lib/socket.js";
import { runAutoScore } from "../lib/scoring.js";

export async function createSession(req, res) {
    try {
        const { problems } = req.body
        const clerkId = req.user.clerkId; // Using clerkId for relationships

        if (!problems || !Array.isArray(problems) || problems.length === 0) {
            return res.status(400).json({ message: "At least one problem is required" })
        }

        const activeProblem = problems[0].title;
        const activeDifficulty = problems[0].difficulty.toLowerCase();

        const sanitizedProblems = problems.map(p => ({
            ...p,
            difficulty: p.difficulty.toLowerCase()
        }));

        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        console.log("Creating session in DB for host:", clerkId);
        const session = await prisma.session.create({
            data: {
                problems: sanitizedProblems,
                problem: activeProblem,
                difficulty: activeDifficulty,
                hostId: clerkId,
                callId,
                timings: [],
                problemCodes: {}
            },
            include: {
                host: true
            }
        });
        console.log("Session created in DB:", session.id);

        console.log("Creating Stream video call...");
        await streamClient.video.call("default", callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom: {
                    problem: activeProblem,
                    difficulty: activeDifficulty,
                    sessionId: session.id
                },
            },
        });

        console.log("Creating Stream chat channel...");
        const channel = chatClient.channel("messaging", callId, {
            name: `${activeProblem} Session`,
            created_by_id: clerkId,
            members: [clerkId],
        });

        await channel.create();
        console.log("Stream session fully created.");

        res.status(201).json({ session: mapId(session) });
    } catch (error) {
        console.error("❌ Error in createSession controller:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export async function getActiveSessions(_, res) {
    try {
        const sessions = await prisma.session.findMany({
            where: { status: "active" },
            include: {
                host: {
                    select: { name: true, profileImage: true, email: true, clerkId: true }
                },
                participant: {
                    select: { name: true, profileImage: true, email: true, clerkId: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        res.status(200).json({ sessions: mapId(sessions) });
    } catch (error) {
        console.error("Error in getActiveSessions controller", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
};

export async function getMyReecentSessions(req, res) {
    try {
        const clerkId = req.user.clerkId

        const sessions = await prisma.session.findMany({
            where: {
                status: "completed",
                OR: [
                    { hostId: clerkId },
                    { participantClerkId: clerkId }
                ],
            },
            include: {
                host: { select: { name: true, email: true, clerkId: true } },
                participant: { select: { name: true, email: true, clerkId: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        res.status(200).json({ sessions: mapId(sessions) })
    } catch (error) {
        console.error("Error in getMyReecentSessions controller", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
};

export async function getSessionById(req, res) {
    try {
        const { id } = req.params

        const session = await prisma.session.findUnique({
            where: { id },
            include: {
                host: { select: { name: true, profileImage: true, email: true, clerkId: true } },
                participant: { select: { name: true, profileImage: true, email: true, clerkId: true } }
            }
        });

        if (!session) return res.status(404).json({ message: "Session is not found" });

        res.status(200).json({ session: mapId(session) })
    } catch (error) {
        console.error("Error in getSessionById controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function joinSession(req, res) {
    try {
        const { id } = req.params
        const clerkId = req.user.clerkId

        const session = await prisma.session.findUnique({
            where: { id }
        });

        if (!session) return res.status(404).json({ message: "Session is not found" });
        if (session.status !== "active") return res.status(400).json({ message: "cannot join completed session" })
        if (session.hostId === clerkId) return res.status(400).json({ message: "host cannot join their own session as participant" })
        if (session.participantClerkId) return res.status(409).json({ message: "Session is full" })

        const updatedSession = await prisma.session.update({
            where: { id },
            data: { participantClerkId: clerkId }
        });

        const channel = chatClient.channel("messaging", session.callId)
        await channel.addMembers([clerkId]);

        res.status(200).json({ session: mapId(updatedSession) })
    } catch (error) {
        console.error("Error in joinSession controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function endSession(req, res) {
    try {
        const { id } = req.params;
        const clerkId = req.user.clerkId;

        const session = await prisma.session.findUnique({
            where: { id }
        });

        if (!session) return res.status(404).json({ message: "Session not found" });
        if (session.hostId !== clerkId) return res.status(403).json({ message: "Only the host can end the session" });
        if (session.status === "completed") return res.status(400).json({ message: "Session is already completed" })

        const call = streamClient.video.call("default", session.callId)
        await call.delete({ hard: true })

        const channel = chatClient.channel("messaging", session.callId)
        await channel.delete()

        const updatedSession = await prisma.session.update({
            where: { id },
            data: { status: "completed" }
        });

        res.status(200).json({ session: mapId(updatedSession), message: "Session ended successfully" })
    } catch (error) {
        console.error("Error in endSession controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function getNotes(req, res) {
    try {
        const { id } = req.params;
        const clerkId = req.user.clerkId;

        const session = await prisma.session.findUnique({
            where: { id }
        });
        if (!session) return res.status(404).json({ message: "Session not found" });
        if (session.hostId !== clerkId) return res.status(403).json({ message: "Only the host can view notes" });

        res.status(200).json({
            notes: session.notes,
            rating: session.rating,
            tags: session.tags,
            timeTaken: session.timeTaken,
            testCasesPassed: session.testCasesPassed,
            timings: session.timings,
        });
    } catch (error) {
        console.error("Error in getNotes controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function saveNotes(req, res) {
    try {
        const { id } = req.params;
        const clerkId = req.user.clerkId;
        const { notes, rating, tags, timeTaken, testCasesPassed } = req.body;

        const session = await prisma.session.findUnique({
            where: { id }
        });
        if (!session) return res.status(404).json({ message: "Session not found" });
        if (session.hostId !== clerkId) return res.status(403).json({ message: "Only the host can save notes" });

        const updatedSession = await prisma.session.update({
            where: { id },
            data: {
                notes: notes !== undefined ? notes : undefined,
                rating: rating !== undefined ? parseInt(rating) : undefined,
                tags: tags !== undefined ? tags : undefined,
                timeTaken: timeTaken !== undefined ? parseInt(timeTaken) : undefined,
                testCasesPassed: testCasesPassed !== undefined ? testCasesPassed : undefined
            }
        });

        res.status(200).json({
            message: "Notes saved",
            notes: updatedSession.notes,
            rating: updatedSession.rating,
            tags: updatedSession.tags,
            timeTaken: updatedSession.timeTaken,
            testCasesPassed: updatedSession.testCasesPassed
        });
    } catch (error) {
        console.error("Error in saveNotes controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function setDecision(req, res) {
    try {
        const { id } = req.params;
        const clerkId = req.user.clerkId;
        const { decision } = req.body;

        const validDecisions = ["move_forward", "on_hold", "rejected", null];
        if (!validDecisions.includes(decision))
            return res.status(400).json({ message: "Invalid decision value" });

        const session = await prisma.session.findUnique({
            where: { id }
        });
        if (!session) return res.status(404).json({ message: "Session not found" });
        if (session.hostId !== clerkId) return res.status(403).json({ message: "Only the host can set the decision" });

        const updatedSession = await prisma.session.update({
            where: { id },
            data: { decision }
        });

        res.status(200).json({ message: "Decision saved", decision: updatedSession.decision });
    } catch (error) {
        console.error("Error in setDecision controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateTimings(req, res) {
    try {
        const { id } = req.params;
        const clerkId = req.user.clerkId;
        const { timings } = req.body;

        const totalDuration = timings.reduce((acc, curr) => acc + (curr.duration || 0), 0);
        const timeTaken = Math.round(totalDuration / 60);

        const updatedSession = await prisma.session.update({
            where: { id, hostId: clerkId },
            data: {
                timings,
                timeTaken
            }
        });

        res.status(200).json({ message: "Timings updated", timings: updatedSession.timings });
    } catch (error) {
        console.error("Error in updateTimings controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateActiveProblem(req, res) {
    try {
        const { id } = req.params;
        const clerkId = req.user.clerkId;
        const { problemTitle, difficulty, codeToSave, previousProblemTitle } = req.body;

        const session = await prisma.session.findUnique({
            where: { id }
        });
        if (!session) return res.status(404).json({ message: "Session not found" });
        if (session.hostId !== clerkId) return res.status(403).json({ message: "Only the host can update the active problem" });

        let updatedCodes = { ...session.problemCodes };
        if (previousProblemTitle && codeToSave !== undefined) {
            updatedCodes[previousProblemTitle] = codeToSave;
        }

        const updatedSession = await prisma.session.update({
            where: { id },
            data: {
                problem: problemTitle,
                difficulty: difficulty.toLowerCase(),
                problemCodes: updatedCodes
            }
        });

        res.status(200).json({
            message: "Active problem updated",
            problem: updatedSession.problem,
            difficulty: updatedSession.difficulty,
            problemCodes: updatedSession.problemCodes
        });
    } catch (error) {
        console.error("Error in updateActiveProblem controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function saveProblemCode(req, res) {
    try {
        const { id, problemId } = req.params;
        const { code } = req.body;

        const session = await prisma.session.findUnique({
            where: { id }
        });
        if (!session) return res.status(404).json({ message: "Session not found" });

        let updatedCodes = { ...session.problemCodes };
        updatedCodes[problemId] = code;

        await prisma.session.update({
            where: { id },
            data: { problemCodes: updatedCodes }
        });

        res.status(200).json({ message: "Code saved for problem", problemId });
    } catch (error) {
        console.error("Error in saveProblemCode controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getProblemCode(req, res) {
    try {
        const { id, problemId } = req.params;

        const session = await prisma.session.findUnique({
            where: { id }
        });
        if (!session) return res.status(404).json({ message: "Session not found" });

        const code = session.problemCodes[problemId] || "";
        res.status(200).json({ code });
    } catch (error) {
        console.error("Error in getProblemCode controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function runCode(req, res) {
    try {
        const { code, language, sessionId, problemId } = req.body;

        const languageVersions = {
            javascript: { language: "javascript", version: "18.15.0" },
            python: { language: "python", version: "3.10.0" },
            java: { language: "java", version: "15.0.2" },
            cpp: { language: "cpp", version: "10.2.0" },
        };

        const config = languageVersions[language] || languageVersions.javascript;

        const normalResponse = await fetch('http://localhost:2000/api/v2/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: config.language,
                version: config.version,
                files: [{ content: code }]
            })
        });

        const normalResult = await normalResponse.json();
        const output = normalResult.run.output || "";
        const stderr = normalResult.run.stderr || "";

        res.json({ success: true, output, stderr });

        // Broadcast "Scoring Started" to the room so Host/Participant see the loader
        const session = await prisma.session.findUnique({ where: { id: sessionId } });
        if (session && session.callId) {
            emitToRoom(session.callId, 'scoring-started', { sessionId });
        }

        // Fire-and-forget background auto-scoring
        runAutoScore({ code, language, sessionId, problemId }).catch(err => {
            console.error("[Scoring] Background auto-score failed:", err);
        });

        // Trigger background auto-scoring via Inngest (Optional - kept for future use)
        // await inngest.send({
        //     name: 'app/code.run',
        //     data: { code, language, sessionId, problemId }
        // });

    } catch (error) {
        console.error("Error in runCode controller:", error.message);
        if (!res.headersSent) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}


export async function updateSessionScore(req, res) {
    try {
        const { id } = req.params;
        const { score } = req.body;

        const updatedSession = await prisma.session.update({
            where: { id },
            data: { testCasesPassed: score }
        });

        res.status(200).json({ message: "Score updated", score: updatedSession.testCasesPassed });
    } catch (error) {
        console.error("Error in updateSessionScore controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
