import { PrismaClient } from "@prisma/client";
import { safetyKnowledge } from "../lib/safety/knowledge";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`UPDATE "Report" SET "reporterName" = "User"."name" FROM "User" WHERE "Report"."authorId" = "User"."id"`;
  await prisma.safetyRule.deleteMany();
  await prisma.safetyRule.createMany({ data: safetyKnowledge.map((rule) => ({ ...rule, keywords: [...rule.keywords] })) });
  console.log("VigiSafe: noms des rapporteurs et consignes SST initialises.");
}

main().finally(() => prisma.$disconnect());
