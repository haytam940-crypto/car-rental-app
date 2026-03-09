import { NextResponse } from "next/server";
import { saveServerReservation } from "@/lib/server-reservations";
import { createPortalToken } from "@/lib/reservation-token";
import { sendClientConfirmation, sendAdminNewReservation } from "@/lib/mailer";
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

    // Emails en parallèle
    await Promise.all([
      sendClientConfirmation({
        clientName,
        clientEmail: reservation.clientEmail,
        reservation: {
          ...reservation,
          carName,
          status: reservation.status ?? "pending",
        },
        portalToken,
      }),
      sendAdminNewReservation({
        reservation: { ...reservation, carName },
      }),
    ]);

    return NextResponse.json({ ok: true, portalToken });
  } catch (err) {
    console.error("[notify]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
