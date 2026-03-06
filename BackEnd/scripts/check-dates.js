import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const sessions = await prisma.session.findMany({
        select: { id: true, createdAt: true, updatedAt: true, problem: true }
    });

    console.log("Sessions Dates:");
    sessions.forEach(s => {
        console.log(`ID: ${s.id}, Prob: ${s.problem}, Created: ${s.createdAt}, Updated: ${s.updatedAt}`);
    });
    await prisma.$disconnect();
}

check();
