import { NextResponse } from "next/server";
import { saveServerReservation, updateServerReservation } from "@/lib/server-reservations";
import { createPortalToken } from "@/lib/reservation-token";
import { sendClientConfirmation } from "@/lib/mailer";
import { CARS } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ── Mise à jour de statut (admin) ──────────────────────────
    if (body._action === "update_status") {
      const updated = updateServerReservation(body.id, { status: body.status });
      if (!updated) return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
      return NextResponse.json({ ok: true });
    }

    // ── Ajout manuel depuis l'admin (sans email) ────────────────
    if (body._action === "manual_add") {
      saveServerReservation(body.reservation);
      return NextResponse.json({ ok: true });
    }

    // ── Nouvelle réservation client (avec email) ────────────────
    const reservation = body;
    saveServerReservation(reservation);

    const portalToken = await createPortalToken(reservation.id);
    const car = CARS.find(c => c.id === reservation.carId);
    const carName = car ? `${car.brand} ${car.name}` : "Véhicule";
    const clientName = `${reservation.clientFirstName} ${reservation.clientLastName}`;

    await sendClientConfirmation({
      clientName,
      clientEmail: reservation.clientEmail,
      reservation: { ...reservation, carName, status: reservation.status ?? "pending" },
      portalToken,
    });

    return NextResponse.json({ ok: true, portalToken });
  } catch (err) {
    console.error("[notify]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
