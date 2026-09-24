import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/remonteur", "/hse", "/directeur"];

export function middleware(request: NextRequest) {
  const isProtected = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();
  if (!request.cookies.get("hse_session")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/remonteur/:path*", "/hse/:path*", "/directeur/:path*"]
};
