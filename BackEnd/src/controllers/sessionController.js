import { prisma } from "../lib/db.js";
import { chatClient, streamClient } from "../lib/stream.js";
import { mapId, getFileExecution } from "../lib/utils.js";
import { inngest } from "../lib/inngest.js";
import { emitToRoom } from "../lib/socket.js";
import { runAutoScore } from "../lib/scoring.js";
import { generateSessionCode, extractSessionIdFromUrl, detectInputType } from "../utils/sessionHelpers.js";
import rateLimit from 'express-rate-limit';

export async function createSession(req, res, next) {

    try {
        let { problems, problemIds, hostId } = req.body
        const clerkId = req.user?.clerkId || hostId; // Use clerkId from auth or hostId from body (Postman)

        // If 'problemIds' are provided instead of full 'problems' objects (as suggested in some READMEs)
        if (!problems && problemIds) {
            const ids = Array.isArray(problemIds) ? problemIds : [problemIds];
            // Try to fetch them from our CustomProblem table first
            const foundProblems = await prisma.customProblem.findMany({
                where: { id: { in: ids } }
            });
            
            // Map found problems or create placeholder objects if not found
            problems = ids.map(id => {
                const found = foundProblems.find(p => p.id === id);
                return found ? { 
                    title: found.title, 
                    difficulty: found.difficulty.toLowerCase() 
                } : { 
                    title: id, 
                    difficulty: "medium" // fallback
                };
            });
        }

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

        // Generate unique session code
        let sessionCode;
        let isUnique = false;

        while (!isUnique) {
            sessionCode = generateSessionCode();
            const existing = await prisma.session.findUnique({
                where: { session_code: sessionCode }
            });
            if (!existing) isUnique = true;
        }

        console.log("Creating session in DB for host:", clerkId);
        const session = await prisma.session.create({
            data: {
                problems: sanitizedProblems,
                problem: activeProblem,
                difficulty: activeDifficulty,
                hostId: clerkId,
                session_code: sessionCode,
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

        res.status(201).json({
            success: true,
            session: mapId(session)
        });
    } catch (error) {
        next(error);
    }
}


export async function getActiveSessions(_, res, next) {

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
        next(error);
    }
};


export async function getMyReecentSessions(req, res, next) {

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
        next(error);
    }
};


export async function getSessionById(req, res, next) {

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
        next(error);
    }
};


export async function joinSession(req, res, next) {

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
        next(error);
    }
};


// Rate limiter — max 10 join attempts per minute per IP
export const joinSessionLimiter = rateLimit({
    windowMs: 60 * 1000,       // 1 minute
    max: 10,                    // max 10 attempts
    message: {
        error: 'Too many join attempts. Please wait a minute and try again.'
    }
})

// POST /api/sessions/join
export const joinSessionByCode = async (req, res, next) => {

    try {
        const { code, link, session_code } = req.body;
        const finalCode = code || session_code;
        const clerkId = req.user?.clerkId;

        // Must provide either code or link
        if (!finalCode && !link) {
            return res.status(400).json({
                error: 'Please provide a session code or link'
            })
        }

        let session = null

        if (finalCode) {
            // Join by short code
            // Always normalize to UPPERCASE before lookup
            const normalizedCode = finalCode.trim().toUpperCase()

            session = await prisma.session.findUnique({
                where: { session_code: normalizedCode },
                include: { host: { select: { id: true, name: true, clerkId: true } } }
            })

        } else if (link) {
            // Join by full URL — extract session ID
            const inputType = detectInputType(link)

            if (inputType !== 'url') {
                return res.status(400).json({
                    error: 'Invalid link format. Please paste a valid session URL.'
                })
            }

            const sessionId = extractSessionIdFromUrl(link)

            if (!sessionId) {
                return res.status(400).json({
                    error: 'Could not extract session ID from this link.'
                })
            }

            session = await prisma.session.findUnique({
                where: { id: sessionId },
                include: { host: { select: { id: true, name: true, clerkId: true } } }
            })
        }

        // Session not found
        if (!session) {
            return res.status(404).json({
                error: 'Invalid link or code. Please check and try again.'
            })
        }

        // Session has ended
        if (session.status === 'ended' || session.status === 'completed') {
            return res.status(400).json({
                error: 'This session has ended and is no longer available.'
            })
        }

        // Check if participant trying to join their own hosted session
        if (session.hostId === clerkId) {
            return res.status(400).json({
                error: 'You cannot join a session you are hosting.'
            })
        }

        // Check if session is full
        if (session.participantClerkId && session.participantClerkId !== clerkId) {
            return res.status(400).json({
                error: 'This session is full. Maximum 2 participants allowed.'
            })
        }

        // Update session with participant
        await prisma.session.update({
            where: { id: session.id },
            data: { participantClerkId: clerkId }
        })

        // Also add to stream chat channel
        const channel = chatClient.channel("messaging", session.callId)
        await channel.addMembers([clerkId]);

        return res.json({
            success: true,
            sessionId: session.id,
            redirectUrl: `/session/${session.id}`,
            hostName: session.host.name
        })

    } catch (error) {
        next(error);
    }
}


export async function endSession(req, res, next) {

    try {
        const { id } = req.params;
        const clerkId = req.user.clerkId;

        const session = await prisma.session.findUnique({
            where: { id }
        });

        if (!session) return res.status(404).json({ message: "Session not found" });
        if (session.hostId !== clerkId) return res.status(403).json({ message: "Only the host can end the session" });
        if (session.status === "completed") return res.status(400).json({ message: "Session is already completed" })

        try {
            const call = streamClient.video.call("default", session.callId)
            await call.delete({ hard: true })
        } catch (streamErr) {
            console.error(`Stream call removal skipped: ${streamErr.message}`);
        }

        try {
            const channel = chatClient.channel("messaging", session.callId)
            await channel.delete()
        } catch (chatErr) {
            console.error(`Stream chat removal skipped: ${chatErr.message}`);
        }

        const updatedSession = await prisma.session.update({
            where: { id },
            data: { status: "completed" }
        });

        res.status(200).json({ session: mapId(updatedSession), message: "Session ended successfully" })
    } catch (error) {
        next(error);
    }
};


export async function getNotes(req, res, next) {

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
            agentSummary: session.agentSummary,
        });
    } catch (error) {
        next(error);
    }
}


export async function saveNotes(req, res, next) {

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
        next(error);
    }
}


export async function setDecision(req, res, next) {

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
        next(error);
    }
}


export async function updateTimings(req, res, next) {

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
        next(error);
    }
}


export async function updateActiveProblem(req, res, next) {

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
        next(error);
    }
}


export async function saveProblemCode(req, res, next) {

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
        next(error);
    }
}


export async function getProblemCode(req, res, next) {

    try {
        const { id, problemId } = req.params;

        const session = await prisma.session.findUnique({
            where: { id }
        });
        if (!session) return res.status(404).json({ message: "Session not found" });

        const code = session.problemCodes[problemId] || "";
        res.status(200).json({ code });
    } catch (error) {
        next(error);
    }
}


export async function runCode(req, res, next) {

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
        const output = normalResult.run.stdout || normalResult.run.output || "";
        const stderr = normalResult.run.stderr || "";

        res.json({ 
            success: normalResult.run.code === 0, 
            output, 
            error: stderr, // Map stderr to error for frontend consistency
            stderr 
        });

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
        next(error);
    }
}



export async function updateSessionScore(req, res, next) {

    try {
        const { id } = req.params;
        const { score } = req.body;

        const updatedSession = await prisma.session.update({
            where: { id },
            data: { testCasesPassed: score }
        });

        res.status(200).json({ message: "Score updated", score: updatedSession.testCasesPassed });
    } catch (error) {
        next(error);
    }
}

