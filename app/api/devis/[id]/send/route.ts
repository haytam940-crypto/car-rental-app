import { NextResponse } from "next/server";
import { getDevisById, updateDevis } from "@/lib/server-devis";
import { sendDevisToClient } from "@/lib/mailer";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { id } = await params;
  const devis = getDevisById(id);
  if (!devis) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  if (!devis.clientEmail) return NextResponse.json({ error: "Email client manquant" }, { status: 400 });

  await sendDevisToClient(devis);

  const updated = updateDevis(id, {
    status: devis.status === "draft" ? "sent" : devis.status,
  });

  return NextResponse.json({ ok: true, devis: updated });
}
