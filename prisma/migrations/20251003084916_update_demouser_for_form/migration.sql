/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - Made the column `fullName` on table `DemoUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `DemoUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `roleKey` on table `DemoUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `roleLabel` on table `DemoUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `DemoUser` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleKey` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleLabel` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_roleId_fkey";

-- AlterTable
ALTER TABLE "public"."DemoUser" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ALTER COLUMN "fullName" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "roleKey" SET NOT NULL,
ALTER COLUMN "roleLabel" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "passwordHash",
ADD COLUMN     "avatarDataUrl" TEXT,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "regNo" TEXT,
ADD COLUMN     "roleKey" "public"."RoleKey" NOT NULL,
ADD COLUMN     "roleLabel" TEXT NOT NULL,
ALTER COLUMN "roleId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "DemoUser_roleKey_idx" ON "public"."DemoUser"("roleKey");

-- CreateIndex
CREATE INDEX "DemoUser_isActive_idx" ON "public"."DemoUser"("isActive");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_regNo_idx" ON "public"."User"("regNo");

-- CreateIndex
CREATE INDEX "User_roleKey_idx" ON "public"."User"("roleKey");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "public"."User"("isActive");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
