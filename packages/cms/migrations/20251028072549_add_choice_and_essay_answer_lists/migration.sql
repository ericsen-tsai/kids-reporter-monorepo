-- CreateTable
CREATE TABLE "PostChoiceAnswer" (
    "id" SERIAL NOT NULL,
    "question" INTEGER,
    "member" TEXT,
    "choiceIndex" INTEGER NOT NULL,
    "correct" BOOLEAN NOT NULL DEFAULT false,
    "compositeKey" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PostChoiceAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostEssayAnswer" (
    "id" SERIAL NOT NULL,
    "question" INTEGER,
    "member" TEXT,
    "content" TEXT NOT NULL DEFAULT '',
    "compositeKey" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PostEssayAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostEssayAnswerLike" (
    "id" SERIAL NOT NULL,
    "answer" INTEGER,
    "member" TEXT,
    "compositeKey" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PostEssayAnswerLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostChoiceAnswer_compositeKey_key" ON "PostChoiceAnswer"("compositeKey");

-- CreateIndex
CREATE INDEX "PostChoiceAnswer_question_idx" ON "PostChoiceAnswer"("question");

-- CreateIndex
CREATE INDEX "PostChoiceAnswer_member_idx" ON "PostChoiceAnswer"("member");

-- CreateIndex
CREATE UNIQUE INDEX "PostEssayAnswer_compositeKey_key" ON "PostEssayAnswer"("compositeKey");

-- CreateIndex
CREATE INDEX "PostEssayAnswer_question_idx" ON "PostEssayAnswer"("question");

-- CreateIndex
CREATE INDEX "PostEssayAnswer_member_idx" ON "PostEssayAnswer"("member");

-- CreateIndex
CREATE UNIQUE INDEX "PostEssayAnswerLike_compositeKey_key" ON "PostEssayAnswerLike"("compositeKey");

-- CreateIndex
CREATE INDEX "PostEssayAnswerLike_answer_idx" ON "PostEssayAnswerLike"("answer");

-- CreateIndex
CREATE INDEX "PostEssayAnswerLike_member_idx" ON "PostEssayAnswerLike"("member");

-- AddForeignKey
ALTER TABLE "PostChoiceAnswer" ADD CONSTRAINT "PostChoiceAnswer_question_fkey" FOREIGN KEY ("question") REFERENCES "PostChoiceQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostChoiceAnswer" ADD CONSTRAINT "PostChoiceAnswer_member_fkey" FOREIGN KEY ("member") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostEssayAnswer" ADD CONSTRAINT "PostEssayAnswer_question_fkey" FOREIGN KEY ("question") REFERENCES "PostEssayQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostEssayAnswer" ADD CONSTRAINT "PostEssayAnswer_member_fkey" FOREIGN KEY ("member") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostEssayAnswerLike" ADD CONSTRAINT "PostEssayAnswerLike_answer_fkey" FOREIGN KEY ("answer") REFERENCES "PostEssayAnswer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostEssayAnswerLike" ADD CONSTRAINT "PostEssayAnswerLike_member_fkey" FOREIGN KEY ("member") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
