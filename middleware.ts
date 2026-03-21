import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth-edge";

// Routes accessibles uniquement par admin
const ADMIN_ONLY_ROUTES = ["/admin/promotions"];

// Routes accessibles par le viewer (lecture seule)
const VIEWER_ALLOWED_ROUTES = ["/admin/dashboard", "/admin/analytics"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const role = token ? await verifySessionToken(token) : null;

    if (!role) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Viewer : uniquement dashboard et analytique
    if (role === "viewer" && !VIEWER_ALLOWED_ROUTES.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // Agent : bloqué sur promotions uniquement
    if (role === "agent" && ADMIN_ONLY_ROUTES.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/admin/reservations", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
