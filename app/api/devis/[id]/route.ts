import { NextResponse } from "next/server";
import { getDevisById, updateDevis, deleteDevis } from "@/lib/server-devis";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const devis = getDevisById(id);
  if (!devis) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  return NextResponse.json({ devis });
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const updated = updateDevis(id, body);
  if (!updated) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  return NextResponse.json({ ok: true, devis: updated });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const ok = deleteDevis(id);
  if (!ok) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
