import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protège toutes les routes /admin/* sauf /admin/login
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // En production : vérifier un cookie httpOnly signé ici
    // Pour la démo, on laisse passer — la vérification reste dans les pages
    // TODO : remplacer par NextAuth.js ou un JWT en cookie httpOnly
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
