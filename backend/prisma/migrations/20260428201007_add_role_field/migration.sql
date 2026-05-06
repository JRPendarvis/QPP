-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

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

-- CreateIndex
CREATE INDEX "block_designs_userId_updatedAt_idx" ON "public"."block_designs"("userId", "updatedAt");

-- AddForeignKey
ALTER TABLE "public"."block_designs" ADD CONSTRAINT "block_designs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
