import { NextRequest } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { Category, Prisma, Zone } from "@prisma/client";
import { getGuestName, getSession } from "@/lib/auth/session";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { classifySeverity } from "@/lib/severity/classifier";
import { createReportSchema } from "@/lib/validation/report";
import { makeReference, reportWhereFromSearch } from "@/lib/reports";
import { prisma } from "@/lib/prisma";

function textValue(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

async function savePhoto(file: File | null) {
  if (!file || file.size === 0) return undefined;
  if (!file.type.startsWith("image/")) throw new Error("Le fichier doit etre une image.");
  if (file.size > 5 * 1024 * 1024) throw new Error("La photo ne doit pas depasser 5 Mo.");
  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = path.extname(file.name).toLowerCase() || ".jpg";
  const fileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), bytes);
  return `/uploads/${fileName}`;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return jsonError("Authentification requise.", 401);
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const take = 9;
    const where = reportWhereFromSearch(searchParams, user.role, user.id);
    const [items, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: { author: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * take,
        take
      }),
      prisma.report.count({ where })
    ]);
    return jsonOk({ items, total, page, pages: Math.ceil(total / take) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    const guestName = user ? null : await getGuestName();
    if (!user && !guestName) return jsonError("Identite du rapporteur requise.", 401);
    const form = await request.formData();
    const data = createReportSchema.parse({
      title: textValue(form, "title"),
      description: textValue(form, "description"),
      voiceTranscript: textValue(form, "voiceTranscript"),
      zone: textValue(form, "zone") as Zone | undefined,
      category: textValue(form, "category") as Category | undefined
    });
    const text = [data.title, data.description, data.voiceTranscript].filter(Boolean).join(" ");
    const severityProposed = classifySeverity(text);
    const count = await prisma.report.count();
    const photoUrl = await savePhoto(form.get("photo") as File | null);
    const title = data.title ?? text.slice(0, 90) ?? "Declaration HAZARD";
    const reporterName = user?.name ?? guestName!;
    const report = await prisma.report.create({
      data: {
        reference: makeReference(count),
        title,
        description: data.description,
        voiceTranscript: data.voiceTranscript,
        photoUrl,
        authorId: user?.id,
        reporterName,
        severityProposed,
        status: "NOUVELLE",
        zone: data.zone ?? "AUTRE",
        category: data.category ?? "AUTRE",
        ...(user ? { history: { create: { userId: user.id, action: "Creation", newValue: "NOUVELLE" } } } : {})
      },
      include: { author: { select: { name: true, email: true } }, history: true }
    });
    return jsonOk(report, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("image")) return jsonError(error.message, 422);
    return handleApiError(error);
  }
}
