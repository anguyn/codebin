/*
  Warnings:

  - You are about to drop the column `language` on the `Snippet` table. All the data in the column will be lost.
  - Added the required column `languageId` to the `Snippet` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Snippet_language_idx";

-- AlterTable
ALTER TABLE "Snippet" DROP COLUMN "language",
ADD COLUMN     "languageId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "fileExt" TEXT[],
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_slug_key" ON "Language"("slug");

-- CreateIndex
CREATE INDEX "Language_slug_idx" ON "Language"("slug");

-- CreateIndex
CREATE INDEX "Language_popularity_idx" ON "Language"("popularity");

-- CreateIndex
CREATE INDEX "Language_isActive_idx" ON "Language"("isActive");

-- CreateIndex
CREATE INDEX "Snippet_languageId_idx" ON "Snippet"("languageId");

-- AddForeignKey
ALTER TABLE "Snippet" ADD CONSTRAINT "Snippet_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
