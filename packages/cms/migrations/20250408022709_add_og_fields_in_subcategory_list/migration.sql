-- AlterTable
ALTER TABLE "Subcategory" ADD COLUMN     "ogDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ogImage" INTEGER,
ADD COLUMN     "ogTitle" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "Subcategory_ogImage_idx" ON "Subcategory"("ogImage");

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_ogImage_fkey" FOREIGN KEY ("ogImage") REFERENCES "Photo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
