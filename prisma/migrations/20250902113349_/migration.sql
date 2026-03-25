/*
  Warnings:

  - Added the required column `author` to the `NewsArticle` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NewsArticle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "publishDate" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL
);
INSERT INTO "new_NewsArticle" ("content", "id", "imageUrl", "publishDate", "slug", "title") SELECT "content", "id", "imageUrl", "publishDate", "slug", "title" FROM "NewsArticle";
DROP TABLE "NewsArticle";
ALTER TABLE "new_NewsArticle" RENAME TO "NewsArticle";
CREATE UNIQUE INDEX "NewsArticle_slug_key" ON "NewsArticle"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
