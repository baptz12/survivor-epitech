-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Founder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startup_id" INTEGER NOT NULL,
    "image_path" TEXT,
    "userId" INTEGER,
    CONSTRAINT "Founder_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "StartupDetail" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Founder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Founder" ("external_id", "id", "image_path", "name", "startup_id") SELECT "external_id", "id", "image_path", "name", "startup_id" FROM "Founder";
DROP TABLE "Founder";
ALTER TABLE "new_Founder" RENAME TO "Founder";
CREATE UNIQUE INDEX "Founder_external_id_key" ON "Founder"("external_id");
CREATE UNIQUE INDEX "Founder_userId_key" ON "Founder"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
