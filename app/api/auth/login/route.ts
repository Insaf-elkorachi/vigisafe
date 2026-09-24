import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return jsonError("Identifiants invalides.", 401);
    }
    await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
    return jsonOk({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    return handleApiError(error);
  }
}
