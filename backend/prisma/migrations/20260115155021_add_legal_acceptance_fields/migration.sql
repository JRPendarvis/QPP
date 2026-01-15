-- AlterTable (idempotent - safe for Railway redeployment)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'termsAcceptedAt'
    ) THEN
        ALTER TABLE "public"."users" ADD COLUMN "termsAcceptedAt" TIMESTAMP(3);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'privacyAcceptedAt'
    ) THEN
        ALTER TABLE "public"."users" ADD COLUMN "privacyAcceptedAt" TIMESTAMP(3);
    END IF;
END $$;
