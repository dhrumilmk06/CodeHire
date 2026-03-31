import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function debug() {
  // Get all sessions with their host clerkIds
  const sessions = await prisma.session.findMany({
    select: { 
      id: true, 
      status: true, 
      hostId: true,
      host: { select: { email: true, name: true } }
    }
  });
  
  console.log("\n=== ALL SESSIONS ===");
  sessions.forEach(s => {
    console.log(`[${s.status}] hostId: ${s.hostId} | host: ${s.host?.name} (${s.host?.email})`);
  });

  // Get all users
  const users = await prisma.user.findMany({
    select: { clerkId: true, email: true, name: true, role: true }
  });
  
  console.log("\n=== ALL USERS ===");
  users.forEach(u => {
    console.log(`Role: ${u.role} | clerkId: ${u.clerkId} | ${u.name} (${u.email})`);
  });
  
  process.exit(0);
}
debug().catch(e => { console.error(e); process.exit(1); });
