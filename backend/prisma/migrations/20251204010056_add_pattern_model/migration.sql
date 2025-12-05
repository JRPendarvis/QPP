-- CreateTable
CREATE TABLE "patterns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "patternData" JSONB NOT NULL,
    "downloaded" BOOLEAN NOT NULL DEFAULT false,
    "downloadedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patterns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "patterns" ADD CONSTRAINT "patterns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
