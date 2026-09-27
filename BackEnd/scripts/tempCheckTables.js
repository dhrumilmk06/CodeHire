import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkColumns() {
    try {
        const columns = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name='standardproblem'`;
        console.log("Columns in database:", columns);
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

checkColumns();
