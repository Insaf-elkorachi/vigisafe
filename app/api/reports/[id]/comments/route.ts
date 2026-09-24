import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { canOperateReports, canSeeReport } from "@/lib/permissions";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

const schema = z.object({ body: z.string().trim().min(2).max(1000) });

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSession();
    if (!user) return jsonError("Authentification requise.", 401);
    const report = await prisma.report.findUnique({ where: { id: params.id } });
    if (!report) return jsonError("HAZARD introuvable.", 404);
    if (!canSeeReport(user, report.authorId) || (user.id !== report.authorId && !canOperateReports(user.role))) {
      return jsonError("Acces refuse.", 403);
    }
    const body = schema.parse(await request.json());
    const comment = await prisma.reportComment.create({ data: { reportId: params.id, authorId: user.id, body: body.body } });
    return jsonOk(comment, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
