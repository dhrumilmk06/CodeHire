import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema({
    input: { type: String, default: "" },
    output: { type: String, default: "" },
    explanation: { type: String, default: "" },
}, { _id: false });

const customProblemSchema = new mongoose.Schema({
    // Owner — the Clerk user ID so we can filter per-user
    createdBy: {
        type: String,
        required: true,
        index: true,
    },
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true,
    },
    category: {
        type: String,
        default: "",
    },
    description: {
        text: { type: String, default: "" },
        notes: [{ type: String }],
    },
    examples: [exampleSchema],
    constraints: [{ type: String }],
    starterCode: {
        javascript: { type: String, default: "" },
        python: { type: String, default: "" },
        java: { type: String, default: "" },
    },
    expectedOutput: {
        javascript: { type: String, default: "" },
        python: { type: String, default: "" },
        java: { type: String, default: "" },
    },
    hiddenTestCases: [
        {
            id: { type: Number },
            description: { type: String },
            inputCode: {
                javascript: { type: String },
                python: { type: String },
                java: { type: String }
            },
            expectedOutput: { type: String },
        }
    ],
}, { timestamps: true });

const CustomProblem = mongoose.model("CustomProblem", customProblemSchema);
export default CustomProblem;
