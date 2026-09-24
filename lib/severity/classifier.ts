import { Severity } from "@prisma/client";

const rules: Array<{ severity: Severity; words: string[] }> = [
  {
    severity: "CRITIQUE",
    words: ["deces", "décès", "explosion", "incendie majeur", "fuite importante", "danger immediat", "danger immédiat", "exposition grave", "accident grave"]
  },
  {
    severity: "ELEVE",
    words: ["risque electrique", "risque électrique", "haute tension", "brulure", "brûlure", "asphyxie"]
  },
  {
    severity: "MAJEUR",
    words: ["chute", "machine dangereuse", "absence de protection", "produit chimique", "equipement dangereux", "équipement dangereux", "non-port", "epi"]
  },
  {
    severity: "MINEUR",
    words: ["sol glissant", "eclairage", "éclairage", "bruit", "rangement", "petit defaut", "petit défaut", "epi manquant", "obstacle"]
  }
];

export function classifySeverity(input: string): Severity {
  const text = input.toLocaleLowerCase("fr-FR");
  for (const rule of rules) {
    if (rule.words.some((word) => text.includes(word))) {
      return rule.severity;
    }
  }
  return "MINEUR";
}
