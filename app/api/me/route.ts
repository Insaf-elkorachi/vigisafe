import { getSession } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  const user = await getSession();
  if (!user) return jsonError("Authentification requise.", 401);
  return jsonOk(user);
}
