-- DropIndex
DROP INDEX IF EXISTS "Applicant_email_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_email_key" ON "Applicant"("email");
