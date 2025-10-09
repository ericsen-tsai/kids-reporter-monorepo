/*
  Warnings:

  - You are about to drop the column `essayQuestionsJSON` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `multipleChoiceQuestionsJSON` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "essayQuestionsJSON",
DROP COLUMN "multipleChoiceQuestionsJSON",
ADD COLUMN     "opening" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "PostChoiceQuestion" (
    "id" SERIAL NOT NULL,
    "post" INTEGER,
    "title" TEXT NOT NULL DEFAULT '',
    "options" JSONB DEFAULT '[]',
    "reason" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PostChoiceQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostEssayQuestion" (
    "id" SERIAL NOT NULL,
    "post" INTEGER,
    "title" TEXT NOT NULL DEFAULT '',
    "hint" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PostEssayQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostChoiceQuestion_post_idx" ON "PostChoiceQuestion"("post");

-- CreateIndex
CREATE INDEX "PostEssayQuestion_post_idx" ON "PostEssayQuestion"("post");

-- AddForeignKey
ALTER TABLE "PostChoiceQuestion" ADD CONSTRAINT "PostChoiceQuestion_post_fkey" FOREIGN KEY ("post") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostEssayQuestion" ADD CONSTRAINT "PostEssayQuestion_post_fkey" FOREIGN KEY ("post") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
