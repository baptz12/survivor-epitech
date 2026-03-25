/*
  Warnings:

  - A unique constraint covering the columns `[founder_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[investor_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_founder_id_key" ON "User"("founder_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_investor_id_key" ON "User"("investor_id");
