import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { canViewAllReports } from "@/lib/permissions";

export function makeReference(count: number) {
  const year = new Date().getFullYear();
  return `HSE-${year}-${String(count + 1).padStart(4, "0")}`;
}

export function reportWhereFromSearch(params: URLSearchParams, role: Role, userId: string): Prisma.ReportWhereInput {
  const where: Prisma.ReportWhereInput = canViewAllReports(role) ? {} : { authorId: userId };
  const severity = params.get("severity");
  const status = params.get("status");
  const zone = params.get("zone");
  const author = params.get("author");
  const start = params.get("start");
  const end = params.get("end");

  if (severity) where.OR = [{ severityValidated: severity as never }, { severityProposed: severity as never }];
  if (status) where.status = status as never;
  if (zone) where.zone = zone as never;
  if (author) where.author = { name: { contains: author, mode: "insensitive" } };
  if (start || end) {
    where.createdAt = {};
    if (start) where.createdAt.gte = new Date(start);
    if (end) where.createdAt.lte = new Date(`${end}T23:59:59.999Z`);
  }
  return where;
}

export async function dashboardData(role: Role, userId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const baseWhere: Prisma.ReportWhereInput = canViewAllReports(role) ? {} : { authorId: userId };
  const where: Prisma.ReportWhereInput = { ...baseWhere, createdAt: { gte: since } };
  const reports = await prisma.report.findMany({
    where,
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" }
  });
  const total = reports.length;
  const severityOf = (report: (typeof reports)[number]) => report.severityValidated ?? report.severityProposed;
  const bySeverity = ["CRITIQUE", "MAJEUR", "MINEUR", "ELEVE"].map((severity) => ({
    severity,
    count: reports.filter((report) => severityOf(report) === severity).length
  }));
  const byZone = Object.entries(
    reports.reduce<Record<string, number>>((acc, report) => {
      acc[report.zone] = (acc[report.zone] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([zone, count]) => ({ zone, count })).sort((a, b) => b.count - a.count).slice(0, 5);
  const byCategory = Object.entries(
    reports.reduce<Record<string, number>>((acc, report) => {
      acc[report.category] = (acc[report.category] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count);
  const byStatus = Object.entries(
    reports.reduce<Record<string, number>>((acc, report) => {
      acc[report.status] = (acc[report.status] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ status, count }));
  const timelineMap = reports.reduce<Record<string, number>>((acc, report) => {
    const key = report.createdAt.toISOString().slice(0, 10);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const timeline = Array.from({ length: Math.min(days, 30) }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (Math.min(days, 30) - 1 - index));
    const key = date.toISOString().slice(0, 10);
    return { date: key.slice(5), count: timelineMap[key] ?? 0 };
  });
  const resolved = reports.filter((report) => report.resolvedAt);
  const averageResolutionHours = resolved.length
    ? Math.round(resolved.reduce((sum, report) => sum + (report.resolvedAt!.getTime() - report.createdAt.getTime()) / 3600000, 0) / resolved.length)
    : 0;
  return {
    total,
    critical: bySeverity.find((item) => item.severity === "CRITIQUE")?.count ?? 0,
    major: bySeverity.find((item) => item.severity === "MAJEUR")?.count ?? 0,
    minor: bySeverity.find((item) => item.severity === "MINEUR")?.count ?? 0,
    elevated: bySeverity.find((item) => item.severity === "ELEVE")?.count ?? 0,
    treatmentRate: total ? Math.round((reports.filter((report) => ["TRAITEE", "FERMEE"].includes(report.status)).length / total) * 100) : 0,
    averageResolutionHours,
    bySeverity,
    byZone,
    byCategory,
    byStatus,
    timeline,
    latest: reports.slice(0, 6)
  };
}
