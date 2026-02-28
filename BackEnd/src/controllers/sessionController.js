import Session from "../models/Session.js";
import { chatClient, streamClient } from "../lib/stream.js";

export async function createSession(req, res) {
    try {
        const { problems } = req.body
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        if (!problems || !Array.isArray(problems) || problems.length === 0) {
            return res.status(400).json({ message: "At least one problem is required" })
        }

        const activeProblem = problems[0].title;
        const activeDifficulty = problems[0].difficulty.toLowerCase();

        // Prepare problems array with lowercased difficulties for consistency
        const sanitizedProblems = problems.map(p => ({
            ...p,
            difficulty: p.difficulty.toLowerCase()
        }));

        //generate uniqu callId for stream video
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        //create session in db
        const session = await Session.create({
            problems: sanitizedProblems,
            problem: activeProblem,
            difficulty: activeDifficulty,
            host: userId,
            callId
        });

        //create stream video call
        await streamClient.video.call("default", callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom: {
                    problem: activeProblem,
                    difficulty: activeDifficulty,
                    sessionId: session._id.toString()
                },
            },
        });

        // chat messaging
        const channel = chatClient.channel("messaging", callId, {
            name: `${activeProblem} Session`,
            created_by_id: clerkId,
            members: [clerkId],
        });

        await channel.create();

        res.status(201).json({ session });
    } catch (error) {
        console.log("Error in createSession controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// this function is for showing active session 
export async function getActiveSessions(_, res) {
    try {
        const sessions = await Session.find({ status: "active" })
            .populate("host", "name profileImage email clerkId")
            .populate("participant", "name profileImage email clerkId") // populate method is use foe fetching details form the model like host detail from User model
            .sort({ createdAt: -1 })// -1 means descending order
            .limit(20);

        res.status(200).json({ sessions });
    } catch (error) {
        console.log("Error in getActiveSessions controller", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
};

//this function show all completed sessions
export async function getMyReecentSessions(req, res) {
    try {
        const userId = req.user._id

        const sessions = await Session.find({
            status: "completed",
            $or: [{ host: userId }, { participant: userId }],
        })
            .populate("host", "name clerkId")
            .populate("participant", "name clerkId")
            .sort({ createdAt: -1 })
            .limit(20)

        res.status(200).json({ sessions })
    } catch (error) {
        console.log("Error in getMyReecentSessions controller", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
};

export async function getSessionById(req, res) {
    try {
        const { id } = req.params

        const session = await Session.findById(id)
            .populate("host", "name profileImage email clerkId")
            .populate("participant", "name profileImage email clerkId");

        if (!session) return res.status(404).json({ message: "Session is not found" });

        res.status(200).json({ session })
    } catch (error) {
        console.log("Error in getSessionById controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function joinSession(req, res) {
    try {
        const { id } = req.params
        const userId = req.user._id
        const clerkId = req.user.clerkId

        const session = await Session.findById(id)

        if (!session) return res.status(404).json({ message: "Session is not found" });

        if (session.status !== "active") return res.status(400).json({ message: "cannot join completed session" })

        if (session.host.toString() == userId.toString()) return res.status(400).json({ message: "host cannot join their own session as participant" })

        if (session.participant) return res.status(409).json({ message: "Session is full" })

        session.participant = userId
        await session.save()

        // adding chat channel in session
        const channel = chatClient.channel("messaging", session.callId)
        await channel.addMembers([clerkId]);

        res.status(200).json({ session })
    } catch (error) {
        console.log("Error in joinSession controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

};

export async function endSession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const session = await Session.findById(id);

        if (!session) return res.status(404).json({ message: "Session not found" });

        // check if user is the host to end session particpant cannot end session
        if (session.host.toString() !== userId.toString()) return res.status(403).json({ message: "Only the host can end the session" });

        // check if session is already completed
        if (session.status == "completed") return res.status(400).json({ message: "Session is alreay completed" })

        // delete stream video call
        const call = streamClient.video.call("default", session.callId)
        await call.delete({ hard: true })

        // delete stream chat channel
        const channel = chatClient.channel("messaging", session.callId)
        await channel.delete()

        session.status = "completed"
        await session.save()

        res.status(200).json({ session, message: "Session ended successfully" })
    } catch (error) {
        console.log("Error in endSession controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

};

// GET /api/sessions/:id/notes — host retrieves saved notes
export async function getNotes(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const session = await Session.findById(id);
        if (!session) return res.status(404).json({ message: "Session not found" });

        if (session.host.toString() !== userId.toString())
            return res.status(403).json({ message: "Only the host can view notes" });

        res.status(200).json({
            notes: session.notes,
            rating: session.rating,
            tags: session.tags,
            timeTaken: session.timeTaken,
            testCasesPassed: session.testCasesPassed,
            timings: session.timings,
        });
    } catch (error) {
        console.log("Error in getNotes controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// POST /api/sessions/:id/notes — host saves notes
export async function saveNotes(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { notes, rating, tags, timeTaken, testCasesPassed } = req.body;

        const session = await Session.findById(id);
        if (!session) return res.status(404).json({ message: "Session not found" });

        if (session.host.toString() !== userId.toString())
            return res.status(403).json({ message: "Only the host can save notes" });

        if (notes !== undefined) session.notes = notes;
        if (rating !== undefined) session.rating = rating;
        if (tags !== undefined) session.tags = tags;
        if (timeTaken !== undefined) session.timeTaken = timeTaken;
        if (testCasesPassed !== undefined) session.testCasesPassed = testCasesPassed;

        await session.save();

        res.status(200).json({
            message: "Notes saved",
            notes: session.notes,
            rating: session.rating,
            tags: session.tags,
            timeTaken: session.timeTaken,
            testCasesPassed: session.testCasesPassed
        });
    } catch (error) {
        console.log("Error in saveNotes controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// PATCH /api/sessions/:id/decision — host sets candidate decision
export async function setDecision(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { decision } = req.body;

        const validDecisions = ["move_forward", "on_hold", "rejected", null];
        if (!validDecisions.includes(decision))
            return res.status(400).json({ message: "Invalid decision value" });

        const session = await Session.findById(id);
        if (!session) return res.status(404).json({ message: "Session not found" });

        if (session.host.toString() !== userId.toString())
            return res.status(403).json({ message: "Only the host can set the decision" });

        session.decision = decision;
        await session.save();

        res.status(200).json({ message: "Decision saved", decision: session.decision });
    } catch (error) {
        console.log("Error in setDecision controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateTimings(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { timings } = req.body;

        const session = await Session.findById(id);
        if (!session) return res.status(404).json({ message: "Session not found" });

        // Calculate legacy timeTaken
        const totalDuration = timings.reduce((acc, curr) => acc + (curr.duration || 0), 0);
        const timeTaken = Math.round(totalDuration / 60);

        // Use findOneAndUpdate to bypass versioning issues and race conditions with rapid updates
        const updatedSession = await Session.findOneAndUpdate(
            { _id: id, host: userId },
            {
                $set: {
                    timings,
                    timeTaken
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedSession) {
            return res.status(404).json({ message: "Session not found or user is not the host" });
        }

        res.status(200).json({ message: "Timings updated", timings: updatedSession.timings });
    } catch (error) {
        console.log("Error in updateTimings controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
