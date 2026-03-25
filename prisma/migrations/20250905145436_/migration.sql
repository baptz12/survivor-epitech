/*
  Warnings:

  - Added the required column `slug_url` to the `NewsDetail` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NewsDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "news_date" TEXT,
    "slug_url" TEXT NOT NULL,
    "location" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "startup_id" INTEGER,
    "description" TEXT NOT NULL
);
INSERT INTO "new_NewsDetail" ("category", "description", "id", "location", "news_date", "startup_id", "title") SELECT "category", "description", "id", "location", "news_date", "startup_id", "title" FROM "NewsDetail";
DROP TABLE "NewsDetail";
ALTER TABLE "new_NewsDetail" RENAME TO "NewsDetail";
CREATE UNIQUE INDEX "NewsDetail_slug_url_key" ON "NewsDetail"("slug_url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
