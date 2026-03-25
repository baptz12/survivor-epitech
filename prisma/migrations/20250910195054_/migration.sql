/*
  Warnings:

  - Made the column `startup_id` on table `News` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startup_id` on table `NewsDetail` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_News" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "news_date" TEXT,
    "location" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "startup_id" INTEGER NOT NULL
);
INSERT INTO "new_News" ("category", "external_id", "id", "location", "news_date", "startup_id", "title") SELECT "category", "external_id", "id", "location", "news_date", "startup_id", "title" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
CREATE UNIQUE INDEX "News_external_id_key" ON "News"("external_id");
CREATE TABLE "new_NewsDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "news_date" TEXT,
    "slug_url" TEXT NOT NULL,
    "location" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "startup_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "image_path" TEXT
);
INSERT INTO "new_NewsDetail" ("category", "description", "external_id", "id", "image_path", "location", "news_date", "slug_url", "startup_id", "title") SELECT "category", "description", "external_id", "id", "image_path", "location", "news_date", "slug_url", "startup_id", "title" FROM "NewsDetail";
DROP TABLE "NewsDetail";
ALTER TABLE "new_NewsDetail" RENAME TO "NewsDetail";
CREATE UNIQUE INDEX "NewsDetail_external_id_key" ON "NewsDetail"("external_id");
CREATE UNIQUE INDEX "NewsDetail_slug_url_key" ON "NewsDetail"("slug_url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
