-- AlterTable
ALTER TABLE "public"."Program" ADD COLUMN "schoolId" TEXT;

-- CreateIndex
CREATE INDEX "Program_schoolId_idx" ON "public"."Program"("schoolId");

-- AddForeignKey
ALTER TABLE "public"."Program" ADD CONSTRAINT "Program_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
