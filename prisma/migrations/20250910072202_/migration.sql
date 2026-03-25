/*
  Warnings:

  - You are about to drop the `_FounderToStartupDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `email` on the `Founder` table. All the data in the column will be lost.
  - Added the required column `external_id` to the `Founder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startup_id` to the `Founder` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_FounderToStartupDetail_B_index";

-- DropIndex
DROP INDEX "_FounderToStartupDetail_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_FounderToStartupDetail";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Founder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startup_id" INTEGER NOT NULL,
    "image_path" TEXT,
    CONSTRAINT "Founder_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "StartupDetail" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Founder" ("id", "image_path", "name") SELECT "id", "image_path", "name" FROM "Founder";
DROP TABLE "Founder";
ALTER TABLE "new_Founder" RENAME TO "Founder";
CREATE UNIQUE INDEX "Founder_external_id_key" ON "Founder"("external_id");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL,
    "founder_id" INTEGER,
    "investor_id" INTEGER,
    "image_path" TEXT
);
INSERT INTO "new_User" ("email", "external_id", "founder_id", "id", "image_path", "investor_id", "name", "password", "role") SELECT "email", "external_id", "founder_id", "id", "image_path", "investor_id", "name", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_external_id_key" ON "User"("external_id");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
