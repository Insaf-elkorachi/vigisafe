-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_authorId_fkey";

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "reporterName" TEXT NOT NULL DEFAULT 'Rapporteur',
ALTER COLUMN "authorId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SafetyRule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "keywords" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafetyRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SafetyRule_category_idx" ON "SafetyRule"("category");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
