import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function compareIds() {
  const users = await prisma.user.findMany({
    select: { clerkId: true, email: true }
  });
  console.log("Users in DB:", users);

  const sessions = await prisma.session.findMany({
    take: 5,
    select: { hostId: true, participantClerkId: true, status: true }
  });
  console.log("Sessions in DB (hostIds):", sessions.map(s => s.hostId));
  process.exit();
}
compareIds();
