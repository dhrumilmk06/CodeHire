import Session from "../models/Session.js";
import { chatClient, streamClient } from "../lib/stream.js";

export async function createSession(req, res) {
    try {
        const {problem, difficulty} = req.body
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        if(!problem || !difficulty){
            return res.status(400).json({message: "Problem and difficulty are required"})
        }

        //generate uniqu callId for stream video
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        //create session in db
        const session = await Session.create({problem, difficulty, host: userId, callId});

        //create stream video call
        await streamClient.video.call("default", callId).getOrCreate({
            data:{
                created_by_id: clerkId,
                custom: {problem, difficulty, sessionId: session._id.toString()},
            },
        });

        // chat messaging
        const channel = chatClient.channel("messaging", callId, {
            name: `${problem} Session`,
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

export async function getActiveSessions(req, res) {};

export async function getMyReecentSessions(req, res) {};

export async function getSessionById(req, res) {};

export async function joinSession(req, res) {};

export async function endSession(req, res) {};

