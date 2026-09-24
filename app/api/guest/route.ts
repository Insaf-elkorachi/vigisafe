import { z } from "zod";
import { NextRequest } from "next/server";
import { createGuestSession } from "@/lib/auth/session";
import { handleApiError, jsonOk } from "@/lib/api";

const guestSchema = z.object({
  name: z.string().trim().min(2, "Le nom est requis.").max(100)
});

export async function POST(request: NextRequest) {
  try {
    const { name } = guestSchema.parse(await request.json());
    await createGuestSession(name);
    return jsonOk({ name });
  } catch (error) {
    return handleApiError(error);
  }
}
