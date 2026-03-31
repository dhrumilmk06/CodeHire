import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function checkSessions() {
  const count = await prisma.session.count();
  console.log(`Total Sessions in DB: ${count}`);
  
  const sessions = await prisma.session.findMany({
    take: 5,
    select: { id: true, hostId: true, participantClerkId: true, status: true }
  });
  console.log("Recent sessions:", sessions);
  process.exit();
}
checkSessions();
