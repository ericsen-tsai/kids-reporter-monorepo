/*
  Warnings:

  - The values [topic,lessons,podcasts,aboutUs] on the enum `CallBaodaozaiIntroPageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CallBaodaozaiIntroPageType_new" AS ENUM ('home', 'all', 'topics', 'news', 'comics', 'campus', 'listeningNews', 'classroom');
ALTER TABLE "CallBaodaozaiIntro" ALTER COLUMN "page" TYPE "CallBaodaozaiIntroPageType_new" USING ("page"::text::"CallBaodaozaiIntroPageType_new");
ALTER TYPE "CallBaodaozaiIntroPageType" RENAME TO "CallBaodaozaiIntroPageType_old";
ALTER TYPE "CallBaodaozaiIntroPageType_new" RENAME TO "CallBaodaozaiIntroPageType";
DROP TYPE "CallBaodaozaiIntroPageType_old";
COMMIT;
