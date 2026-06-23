-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'free',
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'active',
    "billingInterval" TEXT,
    "currentPeriodEnd" TIMESTAMP(3),
    "fabricHoldTier" TEXT NOT NULL DEFAULT 'none',
    "fabricImageLimit" INTEGER NOT NULL DEFAULT 0,
    "downloadsThisMonth" INTEGER NOT NULL DEFAULT 0,
    "generationsThisMonth" INTEGER NOT NULL DEFAULT 0,
    "lastResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "skillLevel" TEXT NOT NULL DEFAULT 'beginner',
    "badge" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "termsAcceptedAt" TIMESTAMP(3),
    "privacyAcceptedAt" TIMESTAMP(3),
    "requiresMonthlyFeedback" BOOLEAN NOT NULL DEFAULT false,
    "feedbackRequirementStartDate" TIMESTAMP(3),
    "feedbackRequirementEndDate" TIMESTAMP(3),
    "lastFeedbackSubmittedAt" TIMESTAMP(3),
    "lastLogIn" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fabrics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "imageUrl" TEXT,
    "type" TEXT,
    "notes" TEXT,
    "yardageAvailable" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "yardageReserved" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tags" JSONB,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fabrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."block_designs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,
    "patternName" TEXT NOT NULL,
    "globalRotation" INTEGER NOT NULL DEFAULT 0,
    "fabrics" JSONB NOT NULL,
    "regions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "block_designs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."patterns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "patternData" JSONB NOT NULL,
    "patternType" TEXT,
    "patternName" TEXT,
    "fabricColors" JSONB,
    "downloaded" BOOLEAN NOT NULL DEFAULT false,
    "downloadedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."feedback" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "authorId" TEXT,
    "votesCount" INTEGER NOT NULL DEFAULT 0,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."feedback_votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."custom_blocks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "blockSize" INTEGER NOT NULL,
    "gridData" JSONB NOT NULL,
    "thumbnail" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "public"."users"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeSubscriptionId_key" ON "public"."users"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "fabrics_userId_archivedAt_idx" ON "public"."fabrics"("userId", "archivedAt");

-- CreateIndex
CREATE INDEX "fabrics_userId_updatedAt_idx" ON "public"."fabrics"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "block_designs_userId_updatedAt_idx" ON "public"."block_designs"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "patterns_userId_downloaded_idx" ON "public"."patterns"("userId", "downloaded");

-- CreateIndex
CREATE INDEX "patterns_downloaded_createdAt_idx" ON "public"."patterns"("downloaded", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "feedback_votes_userId_feedbackId_key" ON "public"."feedback_votes"("userId", "feedbackId");

-- CreateIndex
CREATE INDEX "custom_blocks_userId_idx" ON "public"."custom_blocks"("userId");

-- CreateIndex
CREATE INDEX "custom_blocks_userId_createdAt_idx" ON "public"."custom_blocks"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."fabrics" ADD CONSTRAINT "fabrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."block_designs" ADD CONSTRAINT "block_designs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patterns" ADD CONSTRAINT "patterns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedback_votes" ADD CONSTRAINT "feedback_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedback_votes" ADD CONSTRAINT "feedback_votes_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "public"."feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."custom_blocks" ADD CONSTRAINT "custom_blocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

