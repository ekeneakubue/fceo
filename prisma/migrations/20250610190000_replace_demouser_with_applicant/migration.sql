-- Drop DemoUser table
DROP TABLE IF EXISTS "DemoUser";

-- CreateEnum
CREATE TYPE "ApplicantStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Applicant" (
    "id" TEXT NOT NULL,
    "applicationNo" TEXT NOT NULL,
    "avatarDataUrl" TEXT,
    "surname" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" TEXT,
    "dateOfBirth" TEXT,
    "maritalStatus" TEXT,
    "address" TEXT,
    "countryOfOrigin" TEXT,
    "stateOfOrigin" TEXT,
    "localGovernmentOfOrigin" TEXT,
    "homeTown" TEXT,
    "schoolId" TEXT,
    "programId" TEXT,
    "programType" "ProgramType",
    "status" "ApplicantStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_applicationNo_key" ON "Applicant"("applicationNo");
CREATE INDEX "Applicant_email_idx" ON "Applicant"("email");
CREATE INDEX "Applicant_status_idx" ON "Applicant"("status");
CREATE INDEX "Applicant_schoolId_idx" ON "Applicant"("schoolId");
CREATE INDEX "Applicant_programId_idx" ON "Applicant"("programId");
CREATE INDEX "Applicant_submittedAt_idx" ON "Applicant"("submittedAt");

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;
