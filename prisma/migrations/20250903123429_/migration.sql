/*
  Warnings:

  - You are about to drop the column `description` on the `StartupDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StartupList" ADD COLUMN "description" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StartupDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "legal_status" TEXT,
    "address" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TEXT,
    "website_url" TEXT,
    "social_media_url" TEXT,
    "project_status" TEXT,
    "needs" TEXT,
    "sector" TEXT,
    "maturity" TEXT
);
INSERT INTO "new_StartupDetail" ("address", "created_at", "email", "id", "legal_status", "maturity", "name", "needs", "phone", "project_status", "sector", "social_media_url", "website_url") SELECT "address", "created_at", "email", "id", "legal_status", "maturity", "name", "needs", "phone", "project_status", "sector", "social_media_url", "website_url" FROM "StartupDetail";
DROP TABLE "StartupDetail";
ALTER TABLE "new_StartupDetail" RENAME TO "StartupDetail";
CREATE UNIQUE INDEX "StartupDetail_email_key" ON "StartupDetail"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
