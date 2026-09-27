import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const problem = await prisma.customProblem.findFirst({
    where: { title: 'Two Sum' }
  });
  console.log(JSON.stringify(problem, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
