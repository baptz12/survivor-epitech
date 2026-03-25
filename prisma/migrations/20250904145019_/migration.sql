-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StartupDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "maturity" TEXT
);
INSERT INTO "new_StartupDetail" ("address", "created_at", "description", "email", "id", "legal_status", "maturity", "name", "needs", "phone", "project_status", "sector", "slug_url", "social_media_url", "website_url") SELECT "address", "created_at", "description", "email", "id", "legal_status", "maturity", "name", "needs", "phone", "project_status", "sector", "slug_url", "social_media_url", "website_url" FROM "StartupDetail";
DROP TABLE "StartupDetail";
ALTER TABLE "new_StartupDetail" RENAME TO "StartupDetail";
CREATE UNIQUE INDEX "StartupDetail_slug_url_key" ON "StartupDetail"("slug_url");
CREATE UNIQUE INDEX "StartupDetail_email_key" ON "StartupDetail"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
