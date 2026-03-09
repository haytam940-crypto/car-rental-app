import { NextResponse } from "next/server";
import { saveServerReservation } from "@/lib/server-reservations";
import { createPortalToken } from "@/lib/reservation-token";
import { sendClientConfirmation } from "@/lib/mailer";
import { CARS } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const reservation = await req.json();

    // Sauvegarde côté serveur
    saveServerReservation(reservation);

    // Token sécurisé pour le portail client
    const portalToken = await createPortalToken(reservation.id);

    // Nom du véhicule
    const car = CARS.find(c => c.id === reservation.carId);
    const carName = car ? `${car.brand} ${car.name}` : "Véhicule";

    const clientName = `${reservation.clientFirstName} ${reservation.clientLastName}`;

    // Email de confirmation au client
    await sendClientConfirmation({
      clientName,
      clientEmail: reservation.clientEmail,
      reservation: {
        ...reservation,
        carName,
        status: reservation.status ?? "pending",
      },
      portalToken,
    });

    return NextResponse.json({ ok: true, portalToken });
  } catch (err) {
    console.error("[notify]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
