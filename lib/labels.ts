import { Category, Severity, Status, Zone } from "@prisma/client";

export const severityLabels: Record<Severity, string> = {
  MINEUR: "Mineur",
  MAJEUR: "Majeur",
  ELEVE: "Eleve",
  CRITIQUE: "Critique"
};

export const statusLabels: Record<Status, string> = {
  NOUVELLE: "Nouvelle",
  EN_COURS: "En cours",
  OUVERTE: "Ouverte",
  TRAITEE: "Traitee",
  FERMEE: "Fermee",
  REJETEE: "Rejetee"
};

export const zoneLabels: Record<Zone, string> = {
  ATELIER: "Atelier",
  MAINTENANCE: "Maintenance",
  LOGISTIQUE: "Logistique",
  PRODUCTION: "Production",
  MAGASIN: "Magasin",
  BUREAUX: "Bureaux",
  AUTRE: "Autre"
};

export const categoryLabels: Record<Category, string> = {
  SECURITE: "Securite",
  EQUIPEMENT: "Equipement",
  PRODUIT_CHIMIQUE: "Produit chimique",
  EPI: "EPI",
  ENVIRONNEMENT: "Environnement",
  LOGISTIQUE: "Logistique",
  PRODUCTION: "Production",
  AUTRE: "Autre"
};
