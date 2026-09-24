import { PrismaClient, Category, Severity, Status, Zone } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";
import { classifySeverity } from "../lib/severity/classifier";

const prisma = new PrismaClient();

const descriptions = [
  "Fuite de produit chimique pres de la zone atelier",
  "Chute d'un equipement pendant une operation de maintenance",
  "Sol glissant dans le couloir logistique",
  "Non-port des EPI en atelier",
  "Machine sans protection visible",
  "Eclairage defectueux dans les bureaux",
  "Obstacle sur la voie de circulation",
  "Bruit excessif pres de la production"
];

const zones: Zone[] = ["ATELIER", "MAINTENANCE", "LOGISTIQUE", "PRODUCTION", "MAGASIN", "BUREAUX"];
const categories: Category[] = ["PRODUIT_CHIMIQUE", "EQUIPEMENT", "SECURITE", "EPI", "PRODUCTION", "ENVIRONNEMENT", "LOGISTIQUE"];
const statuses: Status[] = ["EN_COURS", "OUVERTE", "TRAITEE", "FERMEE", "NOUVELLE"];

function severityForIndex(index: number): Severity {
  if (index < 7) return "CRITIQUE";
  if (index < 21) return "MAJEUR";
  return "MINEUR";
}

async function main() {
  await prisma.reportHistory.deleteMany();
  await prisma.reportComment.deleteMany();
  await prisma.report.deleteMany();
  await prisma.user.deleteMany();
  await prisma.safetyRule.deleteMany();

  await prisma.safetyRule.createMany({
    data: [
      { title: "Port des EPI", category: "EPI", content: "Portez les equipements de protection adaptes aux risques de la zone et a la tache realisee.", keywords: ["epi", "casque", "gants", "chaussures", "protection"] },
      { title: "Declaration des hazards", category: "HAZARD", content: "Signalez rapidement toute situation dangereuse ou tout risque observe au moyen d'une declaration HAZARD.", keywords: ["hazard", "danger", "risque", "signaler", "declarer", "situation"] },
      { title: "Circulation", category: "CIRCULATION", content: "Respectez les voies, les zones balisees et les regles de circulation applicables sur le lieu de travail.", keywords: ["circulation", "voie", "vehicule", "pieton", "balise"] },
      { title: "Incendie", category: "INCENDIE", content: "Respectez les consignes d'alerte et d'evacuation et identifiez les moyens d'alerte disponibles.", keywords: ["incendie", "feu", "alerte", "evacuation", "extincteur"] },
      { title: "Travail en hauteur", category: "HAUTEUR", content: "Utilisez les equipements et protections appropries avant tout travail en hauteur.", keywords: ["hauteur", "echelle", "harnais", "chute", "echafaudage"] },
      { title: "Risque electrique", category: "ELECTRICITE", content: "N'intervenez jamais sur une installation electrique sans autorisation et habilitation adaptee.", keywords: ["electrique", "electricite", "installation", "habilitation", "courant"] }
    ]
  });

  const passwordHash = await hashPassword("DemoHSE2026!");
  const [karim, hse, directeur, youssef, sara] = await Promise.all([
    prisma.user.create({ data: { name: "Karim HSE", email: "karim@example.com", passwordHash, role: "REMONTEUR" } }),
    prisma.user.create({ data: { name: "Karim HSE", email: "hse@example.com", passwordHash, role: "RESPONSABLE_HSE" } }),
    prisma.user.create({ data: { name: "Amine Directeur", email: "directeur@example.com", passwordHash, role: "DIRECTEUR" } }),
    prisma.user.create({ data: { name: "Y. El Idrissi", email: "youssef@example.com", passwordHash, role: "REMONTEUR" } }),
    prisma.user.create({ data: { name: "S. Bouzid", email: "sara@example.com", passwordHash, role: "REMONTEUR" } })
  ]);

  const authors = [karim, youssef, sara];
  const now = new Date();
  for (let index = 0; index < 48; index++) {
    const description = descriptions[index % descriptions.length];
    const createdAt = new Date(now);
    createdAt.setDate(now.getDate() - index);
    const severity = severityForIndex(index);
    const resolved = statuses[index % statuses.length] === "TRAITEE" || statuses[index % statuses.length] === "FERMEE";
    await prisma.report.create({
      data: {
        reference: `HSE-${now.getFullYear()}-${String(index + 1).padStart(4, "0")}`,
        title: description,
        description,
        authorId: authors[index % authors.length].id,
        reporterName: authors[index % authors.length].name,
        severityProposed: classifySeverity(description) === "MINEUR" && severity !== "MINEUR" ? severity : classifySeverity(description),
        severityValidated: index % 3 === 0 ? severity : null,
        severityValidatedById: index % 3 === 0 ? hse.id : null,
        severityValidatedAt: index % 3 === 0 ? createdAt : null,
        status: statuses[index % statuses.length],
        zone: zones[index % zones.length],
        category: categories[index % categories.length],
        createdAt,
        resolvedAt: resolved ? new Date(createdAt.getTime() + 48 * 3600000) : null,
        resolvedById: resolved ? hse.id : null,
        history: {
          create: { userId: authors[index % authors.length].id, action: "Creation", newValue: "NOUVELLE", createdAt }
        }
      }
    });
  }

  console.log("Seed termine: comptes demo, 48 hazards et consignes SST crees.");
  console.log("Mot de passe demo: DemoHSE2026!");
}

main().finally(async () => prisma.$disconnect());
