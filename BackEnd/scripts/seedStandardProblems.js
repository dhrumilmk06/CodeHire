import { PrismaClient } from '@prisma/client';
import { PROBLEMS } from '../../FrontEnd/src/data/problems.js';

const prisma = new PrismaClient();

async function seed() {
    console.log("Starting StandardProblem seed process...");
    
    // Extract array of problems from the object
    const problemsArray = Object.values(PROBLEMS);
    const totalProblems = problemsArray.length;
    
    console.log(`Found ${totalProblems} problems to insert.`);

    // Chunk size to prevent memory/timeout issues
    const CHUNK_SIZE = 100;
    let insertedCount = 0;

    try {
        for (let i = 0; i < totalProblems; i += CHUNK_SIZE) {
            const rawChunk = problemsArray.slice(i, i + CHUNK_SIZE);
            
            // Ensure all fields meet schema constraints (e.g., constraints is an array)
            const chunk = rawChunk.map(p => ({
                ...p,
                constraints: p.constraints || [],
                description: p.description || {},
                examples: p.examples || [],
                starterCode: p.starterCode || {},
                expectedOutput: p.expectedOutput || {}
            }));
            
            // createMany is optimized for bulk inserts
            const result = await prisma.standardProblem.createMany({
                data: chunk,
                skipDuplicates: true // Ignore if already inserted
            });

            insertedCount += result.count;
            console.log(`Progress: Inserted ${Math.min(i + CHUNK_SIZE, totalProblems)} / ${totalProblems} problems...`);
        }
        
        console.log(`✅ Seed process completed successfully!`);
        console.log(`🎉 Total unique problems inserted: ${insertedCount}`);
    } catch (error) {
        console.error("❌ Error during seed process:");
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
