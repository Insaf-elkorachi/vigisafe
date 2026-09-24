import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const demoReports = await prisma.report.findMany({
    where: { reference: { startsWith: "HSE-2025-" } },
    orderBy: { reference: "asc" }
  });
  const now = new Date();

  for (const [index, report] of demoReports.entries()) {
    const createdAt = new Date(now);
    createdAt.setDate(now.getDate() - (index % 28));
    createdAt.setHours(8 + (index % 9), (index * 7) % 60, 0, 0);
    const isResolved = report.status === "TRAITEE" || report.status === "FERMEE";

    await prisma.report.update({
      where: { id: report.id },
      data: {
        createdAt,
        resolvedAt: isResolved ? new Date(createdAt.getTime() + (12 + (index % 60)) * 3600000) : null
      }
    });
  }

  console.log(`VigiSafe: ${demoReports.length} hazards de demonstration places sur les 28 derniers jours.`);
}

main().finally(() => prisma.$disconnect());
