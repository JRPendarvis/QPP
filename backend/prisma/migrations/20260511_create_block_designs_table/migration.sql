-- Direct table creation for block_designs
-- This ensures the table is created even if the previous migration's DO block didn't execute

CREATE TABLE IF NOT EXISTS "public"."block_designs" (
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

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS "block_designs_userId_updatedAt_idx" ON "public"."block_designs"("userId", "updatedAt");

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'block_designs_userId_fkey'
  ) THEN
    ALTER TABLE "public"."block_designs" ADD CONSTRAINT "block_designs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
