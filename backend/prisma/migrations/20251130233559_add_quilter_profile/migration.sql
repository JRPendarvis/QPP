-- AlterTable
ALTER TABLE "users" ADD COLUMN     "challengeMe" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "skillLevel" TEXT NOT NULL DEFAULT 'beginner';
