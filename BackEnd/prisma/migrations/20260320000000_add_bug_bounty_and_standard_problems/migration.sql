-- AlterTable User: add banned
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "banned" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "idx_user_clerkid" ON "User"("clerkId");

-- AlterTable Session: add features and metadata columns
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "hints" JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "session_code" TEXT;
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "ai_review" JSONB;
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "report_generated" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "report_url" TEXT;
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "language" VARCHAR(50) DEFAULT 'javascript';
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "agentActive" BOOLEAN DEFAULT false;
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "lastCodeSnapshot" TEXT DEFAULT '';
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "stuckDetectedAt" TIMESTAMP(6);
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "hintsGenerated" INTEGER DEFAULT 0;
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "autoTestsRun" INTEGER DEFAULT 0;
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "agentSummary" TEXT;
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "lastAgentCheckAt" TIMESTAMP(6);
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "timeWarningAt" TIMESTAMP(6);
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "sessionType" TEXT NOT NULL DEFAULT 'coding';
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "decisionStatus" TEXT;
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "decisionSentAt" TIMESTAMP(6);

-- Session Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "Session_session_code_key" ON "Session"("session_code");
CREATE INDEX IF NOT EXISTS "idx_session_code" ON "Session"("session_code");
CREATE INDEX IF NOT EXISTS "idx_session_createdat" ON "Session"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_session_hostid" ON "Session"("hostId");
CREATE INDEX IF NOT EXISTS "idx_session_status" ON "Session"("status");

-- CreateTable WhiteboardSnapshot
CREATE TABLE IF NOT EXISTS "WhiteboardSnapshot" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "imageData" TEXT NOT NULL,
    "excalidrawData" TEXT,
    "label" TEXT,
    "aiScore" INTEGER,
    "aiFeedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhiteboardSnapshot_pkey" PRIMARY KEY ("id")
);

-- WhiteboardSnapshot ForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'WhiteboardSnapshot_sessionId_fkey'
    ) THEN
        ALTER TABLE "WhiteboardSnapshot" ADD CONSTRAINT "WhiteboardSnapshot_sessionId_fkey"
            FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- CreateTable bug_bounty_problems
CREATE TABLE IF NOT EXISTS "bug_bounty_problems" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "bountyPoints" INTEGER NOT NULL DEFAULT 100,
    "bugDescription" TEXT NOT NULL,
    "bugHints" TEXT,
    "buggyCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "difficultyLevel" TEXT,
    "estimatedTimeMinutes" INTEGER,
    "hiddenTestCases" JSONB NOT NULL,
    "initialTestCases" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "correctSolution" TEXT,

    CONSTRAINT "bug_bounty_problems_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "bug_bounty_problems_language_idx" ON "bug_bounty_problems"("language");
CREATE INDEX IF NOT EXISTS "bug_bounty_problems_difficultyLevel_idx" ON "bug_bounty_problems"("difficultyLevel");

-- CreateTable bug_bounty_submissions
CREATE TABLE IF NOT EXISTS "bug_bounty_submissions" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "aiReviewFeedback" TEXT,
    "aiReviewScore" INTEGER,
    "autoTestResult" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalScore" INTEGER,
    "fixedCode" TEXT NOT NULL,
    "manualReviewFeedback" TEXT,
    "manualReviewScore" INTEGER,
    "problemId" INTEGER NOT NULL,
    "sessionId" TEXT,
    "timeTakenSeconds" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "bug_bounty_submissions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "bug_bounty_submissions_problemId_idx" ON "bug_bounty_submissions"("problemId");
CREATE INDEX IF NOT EXISTS "bug_bounty_submissions_userId_idx" ON "bug_bounty_submissions"("userId");
CREATE INDEX IF NOT EXISTS "bug_bounty_submissions_sessionId_idx" ON "bug_bounty_submissions"("sessionId");
CREATE INDEX IF NOT EXISTS "bug_bounty_submissions_status_idx" ON "bug_bounty_submissions"("status");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'bug_bounty_submissions_problemId_fkey'
    ) THEN
        ALTER TABLE "bug_bounty_submissions" ADD CONSTRAINT "bug_bounty_submissions_problemId_fkey"
            FOREIGN KEY ("problemId") REFERENCES "bug_bounty_problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'bug_bounty_submissions_sessionId_fkey'
    ) THEN
        ALTER TABLE "bug_bounty_submissions" ADD CONSTRAINT "bug_bounty_submissions_sessionId_fkey"
            FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- CreateTable bug_bounty_hints_used
CREATE TABLE IF NOT EXISTS "bug_bounty_hints_used" (
    "id" SERIAL NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submissionId" INTEGER NOT NULL,

    CONSTRAINT "bug_bounty_hints_used_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'bug_bounty_hints_used_submissionId_fkey'
    ) THEN
        ALTER TABLE "bug_bounty_hints_used" ADD CONSTRAINT "bug_bounty_hints_used_submissionId_fkey"
            FOREIGN KEY ("submissionId") REFERENCES "bug_bounty_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- CreateTable standardproblem
CREATE TABLE IF NOT EXISTS "standardproblem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" JSONB NOT NULL,
    "examples" JSONB NOT NULL,
    "constraints" TEXT[],
    "startercode" JSONB NOT NULL,
    "expectedoutput" JSONB NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "standardproblem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "standardproblem_category_idx" ON "standardproblem"("category");
CREATE INDEX IF NOT EXISTS "standardproblem_difficulty_idx" ON "standardproblem"("difficulty");
