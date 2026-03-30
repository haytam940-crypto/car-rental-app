import { NextResponse } from "next/server";
import { updateServerReservation } from "@/lib/server-reservations";

/** POST — Mise à jour du statut d'une réservation (PATCH bloqué par Hostinger) */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const updated = updateServerReservation(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, reservation: updated });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
