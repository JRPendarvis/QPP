-- Add Fabric Hold add-on entitlement fields to users
ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "fabricHoldTier" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN IF NOT EXISTS "fabricImageLimit" INTEGER NOT NULL DEFAULT 0;
