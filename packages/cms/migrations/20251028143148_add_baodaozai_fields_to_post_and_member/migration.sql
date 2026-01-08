-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "essayQuestionCount" INTEGER DEFAULT 3,
ADD COLUMN     "showBaodaozai" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "showBaodaozai" BOOLEAN NOT NULL DEFAULT false;
