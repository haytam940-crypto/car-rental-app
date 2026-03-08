import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Laisser passer la page login et les routes API auth
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/auth/")
  ) {
    return NextResponse.next();
  }

  // Protéger toutes les routes /admin/*
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token || !(await verifySessionToken(token))) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
