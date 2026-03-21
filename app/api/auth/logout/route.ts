import { NextResponse } from "next/server";
import { SESSION_COOKIE, ROLE_COOKIE } from "@/lib/auth-edge";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const base = { secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, maxAge: 0, path: "/" };
  res.cookies.set(SESSION_COOKIE, "", { ...base, httpOnly: true });
  res.cookies.set(ROLE_COOKIE, "",    { ...base, httpOnly: false });
  return res;
}
