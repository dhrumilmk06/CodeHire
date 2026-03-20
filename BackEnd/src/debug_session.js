import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const sessionId = 'cmms1fck50002u2i4cuy1xxnv'
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { host: true }
  })
  
  if (!session) {
    console.log("Session NOT FOUND in DB.")
    return
  }

  console.log("SES_ID:", session.id)
  console.log("SES_HOST_ID_COL:", session.hostId)
  console.log("USER_CLERK_ID:", session.host.clerkId)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
