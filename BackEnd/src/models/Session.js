import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    problems: [
        {
            title: { type: String, required: true },
            difficulty: { type: String, required: true },
        }
    ],
    problem: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active"
    },
    // stream video call Id
    callId: {
        type: String,
        default: "",
    },
    // Host-only interview notes
    notes: {
        type: String,
        default: "",
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    tags: {
        type: [String],
        default: [],
    },
    // Host candidate decision after interview
    decision: {
        type: String,
        enum: ["move_forward", "on_hold", "rejected", null],
        default: null,
    },
    // Meta evaluation fields
    timeTaken: {
        type: Number, // in minutes
        default: 0,
    },
    testCasesPassed: {
        type: String, // format "X/Y"
        default: "0/0",
    },
    timings: [
        {
            problemId: { type: String, required: true },
            startTime: { type: Date, required: true },
            endTime: { type: Date, default: null },
            duration: { type: Number, default: null }, // in seconds
        }
    ],
},
    { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema)

export default Session;