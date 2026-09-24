import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { jsonError, jsonOk, handleApiError } from "@/lib/api";
import { dashboardData } from "@/lib/reports";

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return jsonError("Authentification requise.", 401);
    const days = Number(new URL(request.url).searchParams.get("days") ?? 30);
    return jsonOk(await dashboardData(user.role, user.id, days));
  } catch (error) {
    return handleApiError(error);
  }
}
