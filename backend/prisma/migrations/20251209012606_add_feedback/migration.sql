-- CreateTable
CREATE TABLE "feedback" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "authorId" TEXT,
    "votesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feedback_votes_userId_feedbackId_key" ON "feedback_votes"("userId", "feedbackId");

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_votes" ADD CONSTRAINT "feedback_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_votes" ADD CONSTRAINT "feedback_votes_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;
