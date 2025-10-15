/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Avatar` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Avatar" ADD COLUMN     "userId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_userId_key" ON "public"."Avatar"("userId");
