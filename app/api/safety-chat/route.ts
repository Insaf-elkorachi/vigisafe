import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";

const schema = z.object({ question: z.string().trim().min(2).max(500) });
const fallback = "Je ne trouve pas cette information dans les consignes SST disponibles. Veuillez contacter le Responsable HSE.";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    const { question } = schema.parse(await request.json());
    const normalizedQuestion = normalize(question);
    const words = new Set(normalizedQuestion.split(/[^a-z0-9]+/).filter((word) => word.length > 2));
    const rules = await prisma.safetyRule.findMany();
    const ranked = rules
      .map((rule) => {
        const terms = [...rule.keywords, rule.title, rule.category].flatMap((term) => normalize(term).split(/[^a-z0-9]+/));
        const score = terms.reduce((total, term) => total + (words.has(term) ? 1 : 0), 0);
        return { rule, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (!ranked.length) return jsonOk({ answer: fallback, sources: [] });
    const selected = ranked.slice(0, 2).map((item) => item.rule);
    const asksForHeightThreshold = selected.some((rule) => rule.category === "HAUTEUR") && /metre|combien|minimum|seuil|quelle hauteur/.test(normalizedQuestion);
    const clarification = asksForHeightThreshold
      ? "\n\nLa consigne disponible ne precise pas de seuil en metres. Pour connaitre la hauteur minimale ou les exigences applicables a une intervention, veuillez contacter le Responsable HSE."
      : "";
    return jsonOk({
      answer: `${selected.map((rule) => `${rule.title} : ${rule.content}`).join("\n\n")}${clarification}`,
      sources: selected.map((rule) => rule.title)
    });
  } catch (error) {
    return handleApiError(error);
  }
}
