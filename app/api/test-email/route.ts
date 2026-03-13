import { NextResponse } from "next/server";
import { sendClientConfirmation } from "@/lib/mailer";
import { createPortalToken } from "@/lib/reservation-token";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const to = searchParams.get("to");

  if (!to || !to.includes("@")) {
    return NextResponse.json(
      { error: "Paramètre ?to=email@example.com requis" },
      { status: 400 }
    );
  }

  // Réservation de test réaliste
  const fakeReservation = {
    id: `TEST-${Date.now()}`,
    carName: "Dacia Duster 2023",
    pickupDate: "2026-03-18",
    dropoffDate: "2026-03-21",
    pickupLocation: "Aéroport de Ouarzazate",
    dropoffLocation: "Centre-ville Ouarzazate",
    pickupTime: "10:00",
    dropoffTime: "18:00",
    totalPrice: 1050,
    deliveryFee: 150,
    recoveryFee: 0,
    durationDays: 3,
    status: "pending",
  };

  try {
    const portalToken = await createPortalToken(fakeReservation.id);

    await sendClientConfirmation({
      clientName: "Test Client",
      clientEmail: to,
      reservation: fakeReservation,
      portalToken,
    });

    return NextResponse.json({
      ok: true,
      message: `Email de test envoyé à ${to}`,
      portalLink: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation/${encodeURIComponent(portalToken)}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur envoi email", detail: String(err) },
      { status: 500 }
    );
  }
}
