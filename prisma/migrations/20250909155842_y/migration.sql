/*
  Warnings:

  - You are about to drop the column `external_id` on the `Founder` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Founder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image_path" TEXT
);
INSERT INTO "new_Founder" ("id", "image_path", "name") SELECT "id", "image_path", "name" FROM "Founder";
DROP TABLE "Founder";
ALTER TABLE "new_Founder" RENAME TO "Founder";
CREATE UNIQUE INDEX "Founder_name_key" ON "Founder"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
