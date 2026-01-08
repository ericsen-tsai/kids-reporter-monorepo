-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "avatar" INTEGER,
ADD COLUMN     "contactEmail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "nickname" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "MemberAvatar" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "imageFile_id" TEXT,
    "imageFile_filesize" INTEGER,
    "imageFile_width" INTEGER,
    "imageFile_height" INTEGER,
    "imageFile_extension" TEXT,
    "member" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MemberAvatar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MemberAvatar_member_idx" ON "MemberAvatar"("member");

-- CreateIndex
CREATE INDEX "Member_avatar_idx" ON "Member"("avatar");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_avatar_fkey" FOREIGN KEY ("avatar") REFERENCES "MemberAvatar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberAvatar" ADD CONSTRAINT "MemberAvatar_member_fkey" FOREIGN KEY ("member") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
