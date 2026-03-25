/*
  Warnings:

  - Added the required column `external_id` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `Founder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `Investor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `News` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `NewsDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `StartupDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `StartupList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "dates" TEXT,
    "location" TEXT,
    "description" TEXT,
    "event_type" TEXT,
    "target_audience" TEXT,
    "image_path" TEXT
);
INSERT INTO "new_Event" ("dates", "description", "event_type", "id", "image_path", "location", "name", "target_audience") SELECT "dates", "description", "event_type", "id", "image_path", "location", "name", "target_audience" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_external_id_key" ON "Event"("external_id");
CREATE TABLE "new_Founder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startup_id" INTEGER NOT NULL,
    "image_path" TEXT,
    CONSTRAINT "Founder_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "StartupDetail" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Founder" ("id", "image_path", "name", "startup_id") SELECT "id", "image_path", "name", "startup_id" FROM "Founder";
DROP TABLE "Founder";
ALTER TABLE "new_Founder" RENAME TO "Founder";
CREATE UNIQUE INDEX "Founder_external_id_key" ON "Founder"("external_id");
CREATE TABLE "new_Investor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "legal_status" TEXT,
    "address" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TEXT,
    "description" TEXT,
    "investor_type" TEXT,
    "investment_focus" TEXT,
    "image_path" TEXT
);
INSERT INTO "new_Investor" ("address", "created_at", "description", "email", "id", "image_path", "investment_focus", "investor_type", "legal_status", "name", "phone") SELECT "address", "created_at", "description", "email", "id", "image_path", "investment_focus", "investor_type", "legal_status", "name", "phone" FROM "Investor";
DROP TABLE "Investor";
ALTER TABLE "new_Investor" RENAME TO "Investor";
CREATE UNIQUE INDEX "Investor_external_id_key" ON "Investor"("external_id");
CREATE UNIQUE INDEX "Investor_email_key" ON "Investor"("email");
CREATE TABLE "new_News" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "news_date" TEXT,
    "location" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "startup_id" INTEGER
);
INSERT INTO "new_News" ("category", "id", "location", "news_date", "startup_id", "title") SELECT "category", "id", "location", "news_date", "startup_id", "title" FROM "News";
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
    "startup_id" INTEGER,
    "description" TEXT NOT NULL,
    "image_path" TEXT
);
INSERT INTO "new_NewsDetail" ("category", "description", "id", "image_path", "location", "news_date", "slug_url", "startup_id", "title") SELECT "category", "description", "id", "image_path", "location", "news_date", "slug_url", "startup_id", "title" FROM "NewsDetail";
DROP TABLE "NewsDetail";
ALTER TABLE "new_NewsDetail" RENAME TO "NewsDetail";
CREATE UNIQUE INDEX "NewsDetail_external_id_key" ON "NewsDetail"("external_id");
CREATE UNIQUE INDEX "NewsDetail_slug_url_key" ON "NewsDetail"("slug_url");
CREATE TABLE "new_Partner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "legal_status" TEXT,
    "address" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TEXT,
    "description" TEXT,
    "partnership_type" TEXT
);
INSERT INTO "new_Partner" ("address", "created_at", "description", "email", "id", "legal_status", "name", "partnership_type", "phone") SELECT "address", "created_at", "description", "email", "id", "legal_status", "name", "partnership_type", "phone" FROM "Partner";
DROP TABLE "Partner";
ALTER TABLE "new_Partner" RENAME TO "Partner";
CREATE UNIQUE INDEX "Partner_external_id_key" ON "Partner"("external_id");
CREATE UNIQUE INDEX "Partner_email_key" ON "Partner"("email");
CREATE TABLE "new_StartupDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug_url" TEXT NOT NULL,
    "legal_status" TEXT,
    "description" TEXT,
    "address" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TEXT,
    "website_url" TEXT,
    "social_media_url" TEXT,
    "project_status" TEXT,
    "needs" TEXT,
    "sector" TEXT,
    "maturity" TEXT,
    "image_path" TEXT
);
INSERT INTO "new_StartupDetail" ("address", "created_at", "description", "email", "id", "image_path", "legal_status", "maturity", "name", "needs", "phone", "project_status", "sector", "slug_url", "social_media_url", "website_url") SELECT "address", "created_at", "description", "email", "id", "image_path", "legal_status", "maturity", "name", "needs", "phone", "project_status", "sector", "slug_url", "social_media_url", "website_url" FROM "StartupDetail";
DROP TABLE "StartupDetail";
ALTER TABLE "new_StartupDetail" RENAME TO "StartupDetail";
CREATE UNIQUE INDEX "StartupDetail_external_id_key" ON "StartupDetail"("external_id");
CREATE UNIQUE INDEX "StartupDetail_slug_url_key" ON "StartupDetail"("slug_url");
CREATE UNIQUE INDEX "StartupDetail_email_key" ON "StartupDetail"("email");
CREATE TABLE "new_StartupList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "legal_status" TEXT,
    "description" TEXT,
    "address" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "sector" TEXT,
    "maturity" TEXT,
    "image_path" TEXT
);
INSERT INTO "new_StartupList" ("address", "description", "email", "id", "image_path", "legal_status", "maturity", "name", "phone", "sector") SELECT "address", "description", "email", "id", "image_path", "legal_status", "maturity", "name", "phone", "sector" FROM "StartupList";
DROP TABLE "StartupList";
ALTER TABLE "new_StartupList" RENAME TO "StartupList";
CREATE UNIQUE INDEX "StartupList_external_id_key" ON "StartupList"("external_id");
CREATE UNIQUE INDEX "StartupList_email_key" ON "StartupList"("email");
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
INSERT INTO "new_User" ("email", "founder_id", "id", "image_path", "investor_id", "name", "password", "role") SELECT "email", "founder_id", "id", "image_path", "investor_id", "name", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_external_id_key" ON "User"("external_id");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
