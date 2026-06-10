-- CreateEnum
CREATE TYPE "public"."ProgramLevel" AS ENUM ('NCE', 'DEGREE', 'POST_GRADUATE', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" "public"."ProgramLevel" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Program_level_idx" ON "public"."Program"("level");

-- CreateIndex
CREATE INDEX "Program_name_idx" ON "public"."Program"("name");
