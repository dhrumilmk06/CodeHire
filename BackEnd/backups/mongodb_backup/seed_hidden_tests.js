import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CustomProblem from './src/models/CustomProblem.js';

dotenv.config();

const seedHiddenTests = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to DB");

        const problemTitle = "Two Sum";
        const clerkId = "user_3941rvrVxAajsRtU3iKBpHQK0gB"; // From DB

        const hiddenTestCases = [
            {
                id: 1,
                description: "Basic case",
                inputCode: "console.log(JSON.stringify(twoSum([2,7,11,15], 9)))",
                expectedOutput: "[0,1]"
            },
            {
                id: 2,
                description: "Duplicate numbers",
                inputCode: "console.log(JSON.stringify(twoSum([3,3], 6)))",
                expectedOutput: "[0,1]"
            },
            {
                id: 3,
                description: "Target at indices 2 and 3",
                inputCode: "console.log(JSON.stringify(twoSum([1, 5, 10, 20], 30)))",
                expectedOutput: "[2,3]"
            },
            {
                id: 4,
                description: "Large array",
                inputCode: "console.log(JSON.stringify(twoSum([1,2,3,4,5,6,7,8,9,10], 19)))",
                expectedOutput: "[8,9]"
            },
            {
                id: 5,
                description: "Two elements only",
                inputCode: "console.log(JSON.stringify(twoSum([1,2], 3)))",
                expectedOutput: "[0,1]"
            }
        ];

        let problem = await CustomProblem.findOne({ title: problemTitle });

        if (problem) {
            problem.hiddenTestCases = hiddenTestCases;
            await problem.save();
            console.log("Updated existing problem with hidden test cases:", problem.title);
        } else {
            problem = await CustomProblem.create({
                title: problemTitle,
                id: "two-sum",
                difficulty: "Easy",
                ownerClerkId: clerkId,
                hiddenTestCases,
                description: { text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target." },
                starterCode: {
                    javascript: "function twoSum(nums, target) {\n    // Implementation here\n}",
                    python: "def twoSum(nums, target):\n    pass",
                    java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[0];\n    }\n}"
                }
            });
            console.log("Created new problem 'Two Sum' with hidden test cases.");
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error("Error seeding:", err);
    }
};

seedHiddenTests();
