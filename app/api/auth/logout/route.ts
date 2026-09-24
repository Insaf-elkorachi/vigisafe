import { clearSession } from "@/lib/auth/session";
import { jsonOk } from "@/lib/api";

export async function POST() {
  clearSession();
  return jsonOk({ loggedOut: true });
}
