import { NextResponse } from "next/server";
import { saveServerReservation } from "@/lib/server-reservations";
import { Reservation } from "@/lib/data";

/** POST — Ajout manuel d'une réservation depuis l'admin */
export async function POST(req: Request) {
  try {
    const reservation: Reservation = await req.json();
    saveServerReservation(reservation);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
