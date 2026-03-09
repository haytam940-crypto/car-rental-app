import { NextResponse } from "next/server";
import { getAllDevis, saveDevis, Devis } from "@/lib/server-devis";

export async function GET() {
  return NextResponse.json({ devis: getAllDevis() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const devis: Devis = {
      ...body,
      id: body.id ?? `dv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: body.createdAt ?? now,
      updatedAt: now,
      status: body.status ?? "draft",
    };
    saveDevis(devis);
    return NextResponse.json({ ok: true, devis });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
