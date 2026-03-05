import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const session = await prisma.session.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { host: true, participant: true }
    });

    console.log("Latest Session:", JSON.stringify(session, null, 2));
    await prisma.$disconnect();
}

check();
