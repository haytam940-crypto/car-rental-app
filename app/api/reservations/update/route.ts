import { NextResponse } from "next/server";
import { updateServerReservation } from "@/lib/server-reservations";

/** POST — Mise à jour d'une réservation (id + champs dans le body) */
export async function POST(req: Request) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
    const updated = updateServerReservation(id, updates);
    if (!updated) return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
    return NextResponse.json({ ok: true, reservation: updated });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
