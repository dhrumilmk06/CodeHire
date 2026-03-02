import Session from "../models/Session.js";
import CustomProblem from "../models/CustomProblem.js";
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

export async function updateActiveProblem(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { problemTitle, difficulty, codeToSave, previousProblemTitle } = req.body;

        const session = await Session.findById(id);
        if (!session) return res.status(404).json({ message: "Session not found" });

        if (session.host.toString() !== userId.toString())
            return res.status(403).json({ message: "Only the host can update the active problem" });

        // Save progress of previous problem if provided
        if (previousProblemTitle && codeToSave !== undefined) {
            session.problemCodes.set(previousProblemTitle, codeToSave);
        }

        session.problem = problemTitle;
        session.difficulty = difficulty.toLowerCase();

        await session.save();

        res.status(200).json({
            message: "Active problem updated",
            problem: session.problem,
            difficulty: session.difficulty,
            problemCodes: Object.fromEntries(session.problemCodes)
        });
    } catch (error) {
        console.log("Error in updateActiveProblem controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function saveProblemCode(req, res) {
    try {
        const { id, problemId } = req.params;
        const { code } = req.body;

        const session = await Session.findById(id);
        if (!session) return res.status(404).json({ message: "Session not found" });

        // We allow both host and participant to save code, as both contribute
        session.problemCodes.set(problemId, code);
        await session.save();

        res.status(200).json({ message: "Code saved for problem", problemId });
    } catch (error) {
        console.log("Error in saveProblemCode controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getProblemCode(req, res) {
    try {
        const { id, problemId } = req.params;

        const session = await Session.findById(id);
        if (!session) return res.status(404).json({ message: "Session not found" });

        const code = session.problemCodes.get(problemId) || "";
        res.status(200).json({ code });
    } catch (error) {
        console.log("Error in getProblemCode controller:", error.message);
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
        };

        const config = languageVersions[language] || languageVersions.javascript;

        // Step 1: Execute code normally
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

        // Return immediately to frontend for candidate output
        res.json({ success: true, output, stderr });

        // Step 2-4: Process hidden tests in background (Host only update)
        console.log("Looking for problem with title:", problemId);
        const problem = await CustomProblem.findOne({ title: problemId });
        if (problem) {
            console.log("Found problem:", problem.title, "with", problem.hiddenTestCases?.length, "hidden tests");
        } else {
            console.log("Problem not found in CustomProblem collection:", problemId);
        }

        if (problem && problem.hiddenTestCases && problem.hiddenTestCases.length > 0) {
            const results = await Promise.all(
                problem.hiddenTestCases.map(async (test) => {
                    try {
                        // Use language specific input code
                        const langKey = language === "javascript" || language === "python" || language === "java" ? language : "javascript";
                        const testInputCode = test.inputCode?.[langKey];

                        if (!testInputCode) {
                            console.log(`No ${langKey} inputCode found for test`, test.id);
                            return null;
                        }

                        const filename = language === "java" ? "Main.java" : `main${getFileExecution(language)}`;
                        const sanitizedCode = language === "java" ? code.replace(/public\s+class/g, "class") : code;

                        let combinedContent;
                        if (language === "java") {
                            // Extract all import lines from candidate's code
                            const importRegex = /^\s*import\s+.*;/gm;
                            const imports = sanitizedCode.match(importRegex) || [];
                            const codeWithoutImports = sanitizedCode.replace(importRegex, "");

                            // Combine: Imports first, then Test Wrapper (Main), then Candidate code
                            combinedContent = imports.join("\n") + "\n" + testInputCode + "\n" + codeWithoutImports;
                        } else {
                            // Append test code to the end so functions are defined and hidden test is the LAST output
                            combinedContent = sanitizedCode + "\n" + testInputCode;
                        }

                        const executeBody = {
                            language: config.language,
                            version: config.version,
                            files: [
                                { name: filename, content: combinedContent }
                            ]
                        };

                        const testResponse = await fetch('http://localhost:2000/api/v2/execute', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(executeBody)
                        });
                        const testResult = await testResponse.json();
                        const fullOutput = (testResult.run.stdout || "").trim();

                        // Extract the last non-empty line (the one we appended)
                        const lines = fullOutput.split('\n').filter(line => line.trim() !== "");
                        const actualOutput = lines.length > 0 ? lines[lines.length - 1].trim() : "";

                        // Robust comparison: remove all spaces for both actual and expected
                        const normalize = (str) => str.replace(/\s+/g, "");
                        const passed = normalize(actualOutput) === normalize(test.expectedOutput);

                        console.log(`Test ${test.id} result:`, {
                            actual: actualOutput,
                            expected: test.expectedOutput,
                            passed,
                            stderr: testResult.run.stderr || "None"
                        });

                        return { id: test.id, description: test.description, passed };
                    } catch (err) {
                        return { id: test.id, description: test.description, passed: false };
                    }
                })
            );

            const finalResults = results.filter(r => r !== null);
            const passedCount = finalResults.filter(r => r.passed).length;
            const totalCount = finalResults.length;

            if (totalCount === 0) return; // No scoring possible

            const session = await Session.findById(sessionId).populate("host");
            if (session && session.host) {
                const hostClerkId = session.host.clerkId;
                console.log("Emitting autoScoreResults to host:", hostClerkId);
                // Emit only to host's private room
                req.io.to(`user_${hostClerkId}`).emit("autoScoreResults", {
                    sessionId,
                    problemId,
                    score: { passed: passedCount, total: totalCount },
                    results: finalResults
                });
            }
        }
    } catch (error) {
        console.error("Error in runCode controller:", error.message);
        if (!res.headersSent) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

function getFileExecution(language) {
    const extensions = {
        javascript: ".js",
        python: ".py",
        java: ".java"
    };
    return extensions[language] || ".js";
}

export async function updateSessionScore(req, res) {
    try {
        const { id } = req.params;
        const { score } = req.body; // e.g., "3/5"

        const session = await Session.findByIdAndUpdate(
            id,
            { testCasesPassed: score },
            { new: true }
        );

        if (!session) return res.status(404).json({ message: "Session not found" });

        res.status(200).json({ message: "Score updated", score: session.testCasesPassed });
    } catch (error) {
        console.log("Error in updateSessionScore controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
