-- CreateTable
CREATE TABLE "public"."ProgramType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgramType_name_key" ON "public"."ProgramType"("name");

-- Seed program types
INSERT INTO "public"."ProgramType" ("id", "name", "createdAt", "updatedAt") VALUES
    ('ptype_nce', 'NCE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ptype_degree', 'Degree', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ptype_post_graduate', 'Post-Graduate', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ptype_other', 'Other', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- AlterTable
ALTER TABLE "public"."Program" ADD COLUMN "programTypeId" TEXT;

-- Migrate existing level values
UPDATE "public"."Program" SET "programTypeId" = 'ptype_nce' WHERE "level" = 'NCE';
UPDATE "public"."Program" SET "programTypeId" = 'ptype_degree' WHERE "level" = 'DEGREE';
UPDATE "public"."Program" SET "programTypeId" = 'ptype_post_graduate' WHERE "level" = 'POST_GRADUATE';
UPDATE "public"."Program" SET "programTypeId" = 'ptype_other' WHERE "level" = 'OTHER';
UPDATE "public"."Program" SET "programTypeId" = 'ptype_nce' WHERE "programTypeId" IS NULL;

-- DropIndex
DROP INDEX "public"."Program_level_idx";

-- AlterTable
ALTER TABLE "public"."Program" DROP COLUMN "level",
ALTER COLUMN "programTypeId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Program_programTypeId_idx" ON "public"."Program"("programTypeId");

-- AddForeignKey
ALTER TABLE "public"."Program" ADD CONSTRAINT "Program_programTypeId_fkey" FOREIGN KEY ("programTypeId") REFERENCES "public"."ProgramType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropEnum
DROP TYPE "public"."ProgramLevel";
