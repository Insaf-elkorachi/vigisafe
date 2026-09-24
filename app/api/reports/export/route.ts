import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { jsonError, handleApiError } from "@/lib/api";
import { reportWhereFromSearch } from "@/lib/reports";
import { prisma } from "@/lib/prisma";

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return jsonError("Authentification requise.", 401);
    const { searchParams } = new URL(request.url);
    const reports = await prisma.report.findMany({
      where: reportWhereFromSearch(searchParams, user.role, user.id),
      include: { author: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" }
    });
    const header = ["Reference", "Date", "Auteur", "Description", "Gravite", "Zone", "Categorie", "Statut"];
    const rows = reports.map((report) => [
      report.reference,
      report.createdAt.toISOString(),
      report.reporterName || report.author?.name || "Invite",
      report.description ?? report.voiceTranscript ?? report.title,
      report.severityValidated ?? report.severityProposed,
      report.zone,
      report.category,
      report.status
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
    return new NextResponse(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": "attachment; filename=rapport-hse.csv"
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
