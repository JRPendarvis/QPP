-- AlterTable
ALTER TABLE "feedback" ADD COLUMN IF NOT EXISTS "resolved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "patterns" 
ADD COLUMN IF NOT EXISTS "fabricColors" JSONB,
ADD COLUMN IF NOT EXISTS "patternName" TEXT,
ADD COLUMN IF NOT EXISTS "patternType" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "badge" TEXT;

-- CreateIndex (only if doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'patterns_userId_downloaded_idx'
    ) THEN
        CREATE INDEX "patterns_userId_downloaded_idx" ON "patterns"("userId", "downloaded");
    END IF;
END $$;

-- CreateIndex (only if doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'patterns_downloaded_createdAt_idx'
    ) THEN
        CREATE INDEX "patterns_downloaded_createdAt_idx" ON "patterns"("downloaded", "createdAt");
    END IF;
END $$;
