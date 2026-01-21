/*
  Warnings:

  - The values [comics] on the enum `CallBaodaozaiIntroPageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
-- Create the new enum type
CREATE TYPE "CallBaodaozaiIntroPageType_new" AS ENUM ('home', 'all', 'topics', 'news', 'storytelling', 'campus', 'listeningNews', 'classroom');

-- Convert the column, mapping 'comics' to 'storytelling' during conversion
ALTER TABLE "CallBaodaozaiIntro" ALTER COLUMN "page" TYPE "CallBaodaozaiIntroPageType_new" 
  USING (
    CASE 
      WHEN "page"::text = 'comics' THEN 'storytelling'::"CallBaodaozaiIntroPageType_new"
      ELSE "page"::text::"CallBaodaozaiIntroPageType_new"
    END
  );

-- Swap the enum types
ALTER TYPE "CallBaodaozaiIntroPageType" RENAME TO "CallBaodaozaiIntroPageType_old";
ALTER TYPE "CallBaodaozaiIntroPageType_new" RENAME TO "CallBaodaozaiIntroPageType";
DROP TYPE "CallBaodaozaiIntroPageType_old";
COMMIT;
