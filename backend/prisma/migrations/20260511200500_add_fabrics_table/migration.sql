-- Create fabrics table for user fabric library
CREATE TABLE IF NOT EXISTS "public"."fabrics" (
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

-- Indexes used by Prisma model
CREATE INDEX IF NOT EXISTS "fabrics_userId_archivedAt_idx" ON "public"."fabrics"("userId", "archivedAt");
CREATE INDEX IF NOT EXISTS "fabrics_userId_updatedAt_idx" ON "public"."fabrics"("userId", "updatedAt");

-- Foreign key to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'fabrics_userId_fkey'
      AND table_name = 'fabrics'
  ) THEN
    ALTER TABLE "public"."fabrics"
      ADD CONSTRAINT "fabrics_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "public"."users"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END $$;
