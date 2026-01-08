-- CreateEnum
CREATE TYPE "CallBaodaozaiIntroPageType" AS ENUM ('home', 'article', 'topic', 'news', 'search', 'lessons', 'podcasts', 'aboutUs');

-- CreateTable
CREATE TABLE "CallBaodaozaiIntro" (
    "id" SERIAL NOT NULL,
    "page" "CallBaodaozaiIntroPageType" NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "CallBaodaozaiIntro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CallBaodaozaiIntro_page_key" ON "CallBaodaozaiIntro"("page");
