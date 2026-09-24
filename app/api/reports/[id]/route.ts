import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { canOperateReports, canSeeReport } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { updateReportSchema } from "@/lib/validation/report";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSession();
    if (!user) return jsonError("Authentification requise.", 401);
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { name: true, email: true } },
        history: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "asc" } },
        comments: { orderBy: { createdAt: "asc" } }
      }
    });
    if (!report) return jsonError("HAZARD introuvable.", 404);
    if (!canSeeReport(user, report.authorId)) return jsonError("Acces refuse.", 403);
    return jsonOk(report);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSession();
    if (!user) return jsonError("Authentification requise.", 401);
    const existing = await prisma.report.findUnique({ where: { id: params.id } });
    if (!existing) return jsonError("HAZARD introuvable.", 404);
    const input = updateReportSchema.parse(await request.json());
    const operationalKeys = ["severityValidated", "status", "zone", "category"] as const;
    if (operationalKeys.some((key) => input[key] !== undefined) && !canOperateReports(user.role)) {
      return jsonError("Seul le Responsable HSE peut traiter un HAZARD.", 403);
    }
    if (input.description !== undefined && existing.authorId !== user.id && !canOperateReports(user.role)) {
      return jsonError("Modification non autorisee.", 403);
    }
    const data = {
      ...input,
      severityValidatedById: input.severityValidated ? user.id : undefined,
      severityValidatedAt: input.severityValidated ? new Date() : undefined,
      resolvedById: ["TRAITEE", "FERMEE"].includes(input.status ?? "") ? user.id : undefined,
      resolvedAt: ["TRAITEE", "FERMEE"].includes(input.status ?? "") ? new Date() : undefined
    };
    const report = await prisma.report.update({
      where: { id: params.id },
      data: {
        ...data,
        history: {
          create: Object.entries(input).map(([key, value]) => ({
            userId: user.id,
            action: `Modification ${key}`,
            oldValue: String((existing as never as Record<string, unknown>)[key] ?? ""),
            newValue: String(value ?? "")
          }))
        }
      },
      include: { author: { select: { name: true, email: true } }, history: true }
    });
    return jsonOk(report);
  } catch (error) {
    return handleApiError(error);
  }
}
