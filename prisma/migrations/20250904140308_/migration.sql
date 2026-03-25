/*
  Warnings:

  - You are about to drop the column `slug_url` on the `StartupDetail` table. All the data in the column will be lost.
  - Added the required column `startup_url` to the `StartupDetail` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StartupDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startup_url" TEXT NOT NULL,
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
    "maturity" TEXT,
    "description" TEXT
);
INSERT INTO "new_StartupDetail" ("address", "created_at", "description", "email", "id", "legal_status", "maturity", "name", "needs", "phone", "project_status", "sector", "social_media_url", "website_url") SELECT "address", "created_at", "description", "email", "id", "legal_status", "maturity", "name", "needs", "phone", "project_status", "sector", "social_media_url", "website_url" FROM "StartupDetail";
DROP TABLE "StartupDetail";
ALTER TABLE "new_StartupDetail" RENAME TO "StartupDetail";
CREATE UNIQUE INDEX "StartupDetail_startup_url_key" ON "StartupDetail"("startup_url");
CREATE UNIQUE INDEX "StartupDetail_email_key" ON "StartupDetail"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
