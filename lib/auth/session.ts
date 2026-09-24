import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { Role } from "@prisma/client";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

const cookieName = "hse_session";
const guestCookieName = "vigisafe_guest";

function secretKey() {
  const secret = process.env.SESSION_SECRET ?? "development-session-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secretKey());

  cookies().set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export function clearSession() {
  cookies().delete(cookieName);
  cookies().delete(guestCookieName);
}

export async function createGuestSession(name: string) {
  const token = await new SignJWT({ name, type: "guest" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secretKey());

  cookies().set(guestCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 2
  });
}

export async function getGuestName(): Promise<string | null> {
  const token = cookies().get(guestCookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.type === "guest" && typeof payload.name === "string" ? payload.name : null;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return {
      id: String(payload.id),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role as Role
    };
  } catch {
    return null;
  }
}
