/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Investor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `StartupDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `StartupList` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Investor_email_key" ON "Investor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_email_key" ON "Partner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StartupDetail_email_key" ON "StartupDetail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StartupList_email_key" ON "StartupList"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
