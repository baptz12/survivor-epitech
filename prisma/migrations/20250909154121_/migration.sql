/*
  Warnings:

  - You are about to drop the column `startup_id` on the `Founder` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_FounderToStartupDetail" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_FounderToStartupDetail_A_fkey" FOREIGN KEY ("A") REFERENCES "Founder" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FounderToStartupDetail_B_fkey" FOREIGN KEY ("B") REFERENCES "StartupDetail" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Founder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "image_path" TEXT
);
INSERT INTO "new_Founder" ("external_id", "id", "image_path", "name") SELECT "external_id", "id", "image_path", "name" FROM "Founder";
DROP TABLE "Founder";
ALTER TABLE "new_Founder" RENAME TO "Founder";
CREATE UNIQUE INDEX "Founder_external_id_key" ON "Founder"("external_id");
CREATE UNIQUE INDEX "Founder_name_key" ON "Founder"("name");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL,
    "founder_id" INTEGER,
    "investor_id" INTEGER,
    "image_path" TEXT,
    CONSTRAINT "User_founder_id_fkey" FOREIGN KEY ("founder_id") REFERENCES "Founder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("email", "external_id", "founder_id", "id", "image_path", "investor_id", "name", "password", "role") SELECT "email", "external_id", "founder_id", "id", "image_path", "investor_id", "name", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_external_id_key" ON "User"("external_id");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_founder_id_key" ON "User"("founder_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_FounderToStartupDetail_AB_unique" ON "_FounderToStartupDetail"("A", "B");

-- CreateIndex
CREATE INDEX "_FounderToStartupDetail_B_index" ON "_FounderToStartupDetail"("B");
