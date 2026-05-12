-- AlterTable - Check if column exists before adding (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='users' AND column_name='role'
  ) THEN
    ALTER TABLE "public"."users" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
  END IF;
END $$;

-- CreateTable - Check if table exists before creating (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name='block_designs'
  ) THEN
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

    CREATE INDEX "block_designs_userId_updatedAt_idx" ON "public"."block_designs"("userId", "updatedAt");

    ALTER TABLE "public"."block_designs" ADD CONSTRAINT "block_designs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
