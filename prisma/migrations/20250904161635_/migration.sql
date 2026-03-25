/*
  Warnings:

  - Added the required column `description` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_News" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "news_date" TEXT,
    "location" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "startup_id" INTEGER,
    "description" TEXT NOT NULL
);
INSERT INTO "new_News" ("category", "id", "location", "news_date", "startup_id", "title") SELECT "category", "id", "location", "news_date", "startup_id", "title" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
