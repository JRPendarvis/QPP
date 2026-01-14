-- AlterTable
ALTER TABLE "feedback" ADD COLUMN     "resolved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "patterns" ADD COLUMN     "fabricColors" JSONB,
ADD COLUMN     "patternName" TEXT,
ADD COLUMN     "patternType" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "badge" TEXT;

-- CreateIndex
CREATE INDEX "patterns_userId_downloaded_idx" ON "patterns"("userId", "downloaded");

-- CreateIndex
CREATE INDEX "patterns_downloaded_createdAt_idx" ON "patterns"("downloaded", "createdAt");
