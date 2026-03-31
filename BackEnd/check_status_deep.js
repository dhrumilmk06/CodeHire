import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function checkStatus() {
  const sessions = await prisma.session.findMany({
    select: { id: true, status: true, hostId: true }
  });
  console.log("Current session statuses:", sessions);
  process.exit();
}
checkStatus();
