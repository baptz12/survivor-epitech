/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `StartupDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `StartupList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StartupDetail_name_key" ON "StartupDetail"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StartupList_name_key" ON "StartupList"("name");
