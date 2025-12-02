-- CreateTable
CREATE TABLE "users" (
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
    "downloadsThisMonth" INTEGER NOT NULL DEFAULT 0,
    "generationsThisMonth" INTEGER NOT NULL DEFAULT 0,
    "lastResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "skillLevel" TEXT NOT NULL DEFAULT 'beginner',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "users"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeSubscriptionId_key" ON "users"("stripeSubscriptionId");
