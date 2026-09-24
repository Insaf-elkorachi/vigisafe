import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rules = [
  { title: "Port des EPI", category: "EPI", content: "Portez les equipements de protection adaptes aux risques de la zone et a la tache realisee.", keywords: ["epi", "casque", "gants", "chaussures", "protection"] },
  { title: "Declaration des hazards", category: "HAZARD", content: "Signalez rapidement toute situation dangereuse ou tout risque observe au moyen d'une declaration HAZARD.", keywords: ["hazard", "danger", "risque", "signaler", "declarer", "situation"] },
  { title: "Circulation", category: "CIRCULATION", content: "Respectez les voies, les zones balisees et les regles de circulation applicables sur le lieu de travail.", keywords: ["circulation", "voie", "vehicule", "pieton", "balise"] },
  { title: "Incendie", category: "INCENDIE", content: "Respectez les consignes d'alerte et d'evacuation et identifiez les moyens d'alerte disponibles.", keywords: ["incendie", "feu", "alerte", "evacuation", "extincteur"] },
  { title: "Travail en hauteur", category: "HAUTEUR", content: "Utilisez les equipements et protections appropries avant tout travail en hauteur.", keywords: ["hauteur", "echelle", "harnais", "chute", "echafaudage"] },
  { title: "Risque electrique", category: "ELECTRICITE", content: "N'intervenez jamais sur une installation electrique sans autorisation et habilitation adaptee.", keywords: ["electrique", "electricite", "installation", "habilitation", "courant"] }
];

async function main() {
  await prisma.$executeRaw`UPDATE "Report" SET "reporterName" = "User"."name" FROM "User" WHERE "Report"."authorId" = "User"."id"`;
  await prisma.safetyRule.deleteMany();
  await prisma.safetyRule.createMany({ data: rules });
  console.log("VigiSafe: noms des rapporteurs et consignes SST initialises.");
}

main().finally(() => prisma.$disconnect());
