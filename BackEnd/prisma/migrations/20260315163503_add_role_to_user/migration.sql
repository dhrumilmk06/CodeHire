/*
  Warnings:

  - You are about to drop the column `createdBy` on the `CustomProblem` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `CustomProblem` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `CustomProblem` table. All the data in the column will be lost.
  - You are about to drop the column `activeProblem` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `autoScore` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `endedAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `problemIds` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `starRating` on the `Session` table. All the data in the column will be lost.
  - Added the required column `ownerClerkId` to the `CustomProblem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CustomProblem` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `description` on the `CustomProblem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `difficulty` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problem` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problems` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_hostId_fkey";

-- AlterTable
ALTER TABLE "CustomProblem" DROP COLUMN "createdBy",
DROP COLUMN "isPublic",
DROP COLUMN "tags",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "constraints" TEXT[],
ADD COLUMN     "expectedOutput" JSONB,
ADD COLUMN     "ownerClerkId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "activeProblem",
DROP COLUMN "autoScore",
DROP COLUMN "endedAt",
DROP COLUMN "participantId",
DROP COLUMN "problemIds",
DROP COLUMN "starRating",
ADD COLUMN     "callId" TEXT,
ADD COLUMN     "difficulty" TEXT NOT NULL,
ADD COLUMN     "participantClerkId" TEXT,
ADD COLUMN     "problem" TEXT NOT NULL,
ADD COLUMN     "problems" JSONB NOT NULL,
ADD COLUMN     "rating" INTEGER DEFAULT 0,
ADD COLUMN     "testCasesPassed" TEXT DEFAULT '0/0',
ADD COLUMN     "timeTaken" INTEGER DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "problemCodes" DROP DEFAULT,
ALTER COLUMN "timings" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'participant',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "CustomProblem_ownerClerkId_idx" ON "CustomProblem"("ownerClerkId");

-- CreateIndex
CREATE INDEX "CustomProblem_title_idx" ON "CustomProblem"("title");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_participantClerkId_fkey" FOREIGN KEY ("participantClerkId") REFERENCES "User"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;
