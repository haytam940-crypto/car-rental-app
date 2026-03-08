import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth-edge";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass  = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPass) {
      return NextResponse.json({ error: "Serveur mal configuré." }, { status: 500 });
    }

    // Délai constant pour contrer le timing attack
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 300));

    if (email !== adminEmail || password !== adminPass) {
      return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
    }

    const token = await createSessionToken();

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60, // 8h en secondes
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
