import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const session = await prisma.session.findFirst({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' },
    select: { id: true, problem: true, language: true, problemCodes: true, lastCodeSnapshot: true }
  });
  console.log(JSON.stringify(session, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
