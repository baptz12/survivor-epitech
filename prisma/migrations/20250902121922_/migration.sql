/*
  Warnings:

  - You are about to drop the `NewsArticle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Event` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `startupId` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `name` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "NewsArticle_slug_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NewsArticle";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Project";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "News" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "news_date" TEXT,
    "AnyOf" TEXT,
    "location" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "startup_id" INTEGER,
    CONSTRAINT "News_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "StartupDetail" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NewsDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "news_date" TEXT,
    "location" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "startup_id" INTEGER,
    "description" TEXT NOT NULL,
    CONSTRAINT "NewsDetail_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "StartupDetail" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "legal_status" TEXT,
    "address" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TEXT,
    "description" TEXT,
    "partnership_type" TEXT
);

-- CreateTable
CREATE TABLE "StartupDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "legal_status" TEXT,
    "address" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TEXT,
    "description" TEXT,
    "website_url" TEXT,
    "social_media_url" TEXT,
    "project_status" TEXT,
    "needs" TEXT,
    "sector" TEXT,
    "maturity" TEXT
);

-- CreateTable
CREATE TABLE "StartupList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "legal_status" TEXT,
    "address" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "sector" TEXT,
    "maturity" TEXT
);

-- CreateTable
CREATE TABLE "Founder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startup_id" INTEGER NOT NULL,
    CONSTRAINT "Founder_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "StartupDetail" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Investor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "legal_status" TEXT,
    "address" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TEXT,
    "description" TEXT,
    "investor_type" TEXT,
    "investment_focus" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "dates" TEXT,
    "location" TEXT,
    "description" TEXT,
    "event_type" TEXT,
    "target_audience" TEXT
);
INSERT INTO "new_Event" ("description", "id") SELECT "description", "id" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "founder_id" INTEGER,
    "investor_id" INTEGER,
    CONSTRAINT "User_founder_id_fkey" FOREIGN KEY ("founder_id") REFERENCES "Founder" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("email", "id", "role") SELECT "email", "id", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
