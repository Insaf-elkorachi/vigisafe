-- CreateEnum
CREATE TYPE "Role" AS ENUM ('REMONTEUR', 'RESPONSABLE_HSE', 'DIRECTEUR');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('MINEUR', 'MAJEUR', 'ELEVE', 'CRITIQUE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOUVELLE', 'EN_COURS', 'OUVERTE', 'TRAITEE', 'FERMEE', 'REJETEE');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SECURITE', 'EQUIPEMENT', 'PRODUIT_CHIMIQUE', 'EPI', 'ENVIRONNEMENT', 'LOGISTIQUE', 'PRODUCTION', 'AUTRE');

-- CreateEnum
CREATE TYPE "Zone" AS ENUM ('ATELIER', 'MAINTENANCE', 'LOGISTIQUE', 'PRODUCTION', 'MAGASIN', 'BUREAUX', 'AUTRE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "voiceTranscript" TEXT,
    "photoUrl" TEXT,
    "authorId" TEXT NOT NULL,
    "severityProposed" "Severity" NOT NULL,
    "severityValidated" "Severity",
    "severityValidatedById" TEXT,
    "severityValidatedAt" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'NOUVELLE',
    "zone" "Zone" NOT NULL DEFAULT 'AUTRE',
    "category" "Category" NOT NULL DEFAULT 'AUTRE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportHistory" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportComment" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Report_reference_key" ON "Report"("reference");

-- CreateIndex
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");

-- CreateIndex
CREATE INDEX "Report_severityProposed_idx" ON "Report"("severityProposed");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_zone_idx" ON "Report"("zone");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_severityValidatedById_fkey" FOREIGN KEY ("severityValidatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportHistory" ADD CONSTRAINT "ReportHistory_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportHistory" ADD CONSTRAINT "ReportHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportComment" ADD CONSTRAINT "ReportComment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
