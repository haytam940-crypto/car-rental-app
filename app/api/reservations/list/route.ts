import { NextResponse } from "next/server";
import { getAllServerReservations } from "@/lib/server-reservations";

/** Endpoint appelé par le dashboard admin pour récupérer les réservations côté serveur */
export async function GET() {
  try {
    const reservations = getAllServerReservations();
    return NextResponse.json({ reservations });
  } catch {
    return NextResponse.json({ reservations: [] });
  }
}
