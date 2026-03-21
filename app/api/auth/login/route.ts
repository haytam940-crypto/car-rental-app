import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, ROLE_COOKIE, UserRole } from "@/lib/auth-edge";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const adminEmail  = process.env.ADMIN_EMAIL;
    const adminPass   = process.env.ADMIN_PASSWORD;
    const agentEmail  = process.env.AGENT_EMAIL;
    const agentPass   = process.env.AGENT_PASSWORD;
    const viewerEmail = process.env.VIEWER_EMAIL;
    const viewerPass  = process.env.VIEWER_PASSWORD;

    if (!adminEmail || !adminPass) {
      return NextResponse.json({ error: "Serveur mal configuré." }, { status: 500 });
    }

    // Délai constant pour contrer le timing attack
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 300));

    let role: UserRole | null = null;
    if (email === adminEmail && password === adminPass) {
      role = "admin";
    } else if (agentEmail && agentPass && email === agentEmail && password === agentPass) {
      role = "agent";
    } else if (viewerEmail && viewerPass && email === viewerEmail && password === viewerPass) {
      role = "viewer";
    }

    if (!role) {
      return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
    }

    const token = await createSessionToken(role);
    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 8 * 60 * 60,
      path: "/",
    };

    const res = NextResponse.json({ ok: true, role });
    res.cookies.set(SESSION_COOKIE, token, cookieOpts);
    // Cookie de rôle lisible côté client (non httpOnly) pour filtrer la navigation
    res.cookies.set(ROLE_COOKIE, role, { ...cookieOpts, httpOnly: false });
    return res;
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
