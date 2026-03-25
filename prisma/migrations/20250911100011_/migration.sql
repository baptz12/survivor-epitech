/*
  Warnings:

  - You are about to drop the column `userId` on the `Founder` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Founder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "external_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startup_id" INTEGER NOT NULL,
    "image_path" TEXT,
    CONSTRAINT "Founder_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "StartupDetail" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Founder" ("external_id", "id", "image_path", "name", "startup_id") SELECT "external_id", "id", "image_path", "name", "startup_id" FROM "Founder";
DROP TABLE "Founder";
ALTER TABLE "new_Founder" RENAME TO "Founder";
CREATE UNIQUE INDEX "Founder_external_id_key" ON "Founder"("external_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
