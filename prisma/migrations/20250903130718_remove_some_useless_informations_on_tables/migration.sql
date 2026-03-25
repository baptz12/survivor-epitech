/*
  Warnings:

  - You are about to drop the column `AnyOf` on the `News` table. All the data in the column will be lost.

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
    "startup_id" INTEGER
);
INSERT INTO "new_News" ("category", "id", "location", "news_date", "startup_id", "title") SELECT "category", "id", "location", "news_date", "startup_id", "title" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
CREATE TABLE "new_NewsDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "news_date" TEXT,
    "location" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "startup_id" INTEGER,
    "description" TEXT NOT NULL
);
INSERT INTO "new_NewsDetail" ("category", "description", "id", "location", "news_date", "startup_id", "title") SELECT "category", "description", "id", "location", "news_date", "startup_id", "title" FROM "NewsDetail";
DROP TABLE "NewsDetail";
ALTER TABLE "new_NewsDetail" RENAME TO "NewsDetail";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL,
    "founder_id" INTEGER,
    "investor_id" INTEGER
);
INSERT INTO "new_User" ("email", "founder_id", "id", "investor_id", "name", "password", "role") SELECT "email", "founder_id", "id", "investor_id", "name", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
