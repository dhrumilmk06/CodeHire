import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const clerkId = 'user_3AIopfsQqJji0oLDdeLxAd3uzwF'
  const sessions = await prisma.session.findMany({
    where: { hostId: clerkId },
    take: 5
  })
  
  if (sessions.length === 0) {
    console.log("No sessions found for this user.")
  } else {
    console.log("Found sessions for this user:", sessions.map(s => s.id))
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
