/*
  Warnings:

  - A unique constraint covering the columns `[founder_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Founder` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Founder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image_path" TEXT
);
INSERT INTO "new_Founder" ("id", "image_path", "name") SELECT "id", "image_path", "name" FROM "Founder";
DROP TABLE "Founder";
ALTER TABLE "new_Founder" RENAME TO "Founder";
CREATE UNIQUE INDEX "Founder_name_key" ON "Founder"("name");
CREATE UNIQUE INDEX "Founder_email_key" ON "Founder"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_founder_id_key" ON "User"("founder_id");
