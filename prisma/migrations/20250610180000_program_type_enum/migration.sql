-- Clean up partial applies
ALTER TABLE "public"."Program" DROP COLUMN IF EXISTS "programType";
ALTER TABLE "public"."Program" ADD COLUMN IF NOT EXISTS "programType_migrate" TEXT;

-- Copy values from ProgramType model table (text avoids name clash with the table type)
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'Program' AND column_name = 'programTypeId'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'ProgramType'
    ) THEN
        UPDATE "public"."Program" p
        SET "programType_migrate" = CASE pt."name"
            WHEN 'NCE' THEN 'NCE'
            WHEN 'Degree' THEN 'DEGREE'
            WHEN 'Post-Graduate' THEN 'POST_GRADUATE'
            ELSE 'NCE'
        END
        FROM "public"."ProgramType" pt
        WHERE p."programTypeId" = pt."id";
    END IF;
END $$;

UPDATE "public"."Program" SET "programType_migrate" = 'NCE' WHERE "programType_migrate" IS NULL;

-- Remove ProgramType model (table type blocks enum of the same name)
ALTER TABLE "public"."Program" DROP CONSTRAINT IF EXISTS "Program_programTypeId_fkey";
DROP INDEX IF EXISTS "public"."Program_programTypeId_idx";
ALTER TABLE "public"."Program" DROP COLUMN IF EXISTS "programTypeId";
DROP TABLE IF EXISTS "public"."ProgramType";
DROP TYPE IF EXISTS "public"."ProgramType";

-- CreateEnum
CREATE TYPE "public"."ProgramType" AS ENUM ('NCE', 'DEGREE', 'POST_GRADUATE');

-- AlterTable
ALTER TABLE "public"."Program"
    ADD COLUMN "programType" "public"."ProgramType" NOT NULL DEFAULT 'NCE';

UPDATE "public"."Program"
SET "programType" = "programType_migrate"::"public"."ProgramType";

ALTER TABLE "public"."Program" ALTER COLUMN "programType" DROP DEFAULT;
ALTER TABLE "public"."Program" DROP COLUMN "programType_migrate";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Program_programType_idx" ON "public"."Program"("programType");
