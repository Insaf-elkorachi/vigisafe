import { Role } from "@prisma/client";
import { SessionUser } from "@/lib/auth/session";

export function canViewAllReports(role: Role) {
  return role === "RESPONSABLE_HSE" || role === "DIRECTEUR";
}

export function canOperateReports(role: Role) {
  return role === "RESPONSABLE_HSE";
}

export function canSeeReport(user: SessionUser, authorId: string | null) {
  return canViewAllReports(user.role) || user.id === authorId;
}

export function assertRole(user: SessionUser | null, allowed: Role[]) {
  if (!user) {
    return { ok: false as const, status: 401, message: "Authentification requise." };
  }
  if (!allowed.includes(user.role)) {
    return { ok: false as const, status: 403, message: "Action non autorisee pour ce role." };
  }
  return { ok: true as const, user };
}
