import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const rules = await prisma.safetyRule.findMany({ orderBy: { title: "asc" } });
    return jsonOk(rules);
  } catch (error) {
    return handleApiError(error);
  }
}
