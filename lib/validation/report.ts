import { Category, Severity, Status, Zone } from "@prisma/client";
import { z } from "zod";

export const createReportSchema = z.object({
  title: z.string().trim().min(3).max(160).optional(),
  description: z.string().trim().max(3000).optional(),
  voiceTranscript: z.string().trim().max(3000).optional(),
  zone: z.nativeEnum(Zone).optional(),
  category: z.nativeEnum(Category).optional()
}).refine((value) => Boolean(value.description || value.voiceTranscript || value.title), {
  message: "Une description texte ou vocale est requise."
});

export const updateReportSchema = z.object({
  severityValidated: z.nativeEnum(Severity).optional(),
  status: z.nativeEnum(Status).optional(),
  zone: z.nativeEnum(Zone).optional(),
  category: z.nativeEnum(Category).optional(),
  description: z.string().trim().max(3000).optional()
});

export const reportFilterSchema = z.object({
  severity: z.nativeEnum(Severity).optional(),
  status: z.nativeEnum(Status).optional(),
  zone: z.nativeEnum(Zone).optional(),
  author: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  page: z.coerce.number().int().positive().default(1)
});
