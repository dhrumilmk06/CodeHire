import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const testProblem = {
    title: "CRUD Test Problem",
    id: "crud-test-problem",
    difficulty: "Low",
    category: "Testing",
    description: { text: "Verify that creating, editing, and deleting custom problems still works perfectly with the new PostgreSQL schema." },
    ownerClerkId: "test-user-id", // Placeholder
    examples: [],
    starterCode: { javascript: "// code" },
    hiddenTestCases: [],
};

async function verifyCRUD() {
    try {
        console.log("--- Verifying Problem CRUD ---");

        // 1. Create Problem
        const created = await prisma.customProblem.create({
            data: {
                ...testProblem,
            }
        });
        console.log("✅ Create Problem: OK (id:", created.id, ")");

        // 2. Read Problem
        const read = await prisma.customProblem.findUnique({
            where: { id: testProblem.id }
        });
        if (read && read.title === testProblem.title) {
            console.log("✅ Read Problem: OK");
        } else {
            throw new Error("❌ Read Problem: FAILED");
        }

        // 3. Update Problem
        const updated = await prisma.customProblem.update({
            where: { id: testProblem.id },
            data: { difficulty: "Medium" }
        });
        if (updated.difficulty === "Medium") {
            console.log("✅ Update Problem: OK");
        } else {
            throw new Error("❌ Update Problem: FAILED");
        }

        // 4. Delete Problem
        await prisma.customProblem.delete({
            where: { id: testProblem.id }
        });
        const deleted = await prisma.customProblem.findUnique({
            where: { id: testProblem.id }
        });
        if (!deleted) {
            console.log("✅ Delete Problem: OK");
        } else {
            throw new Error("❌ Delete Problem: FAILED");
        }

        console.log("🎉 CRUD Verification Completed Successfully!");
    } catch (err) {
        console.error("❌ CRUD Verification FAILED:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

verifyCRUD();
