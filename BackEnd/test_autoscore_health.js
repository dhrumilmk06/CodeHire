import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CustomProblem from './src/models/CustomProblem.js';

dotenv.config();

const testLookup = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ Connected to DB");

        const allProblems = await CustomProblem.find({});
        console.log(`\n--- PROBLEM LOOKUP DIAGNOSTIC (${allProblems.length} Total) ---`);

        const summary = allProblems.map(p => ({
            title: p.title,
            owner: p.ownerClerkId === "system" ? "SYSTEM" : "USER",
            hiddenTests: p.hiddenTestCases?.length || 0
        }));

        console.table(summary);

        const criticalMissing = summary.filter(p => p.hiddenTests === 0);
        if (criticalMissing.length > 0) {
            console.warn("⚠️ WARNING: These problems are missing hidden tests:", criticalMissing.map(p => p.title));
        } else {
            console.log("✨ SUCCESS: All problems have hidden test cases ready for auto-scoring.");
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error during diagnostic:", err);
    }
};

testLookup();
