import { NextResponse } from "next/server";
import { verifyPortalToken, createPortalToken } from "@/lib/reservation-token";
import { getServerReservationById, updateServerReservation } from "@/lib/server-reservations";
import { sendClientModificationConfirm, sendClientCancellationConfirm } from "@/lib/mailer";
import { CARS } from "@/lib/data";

type Params = { params: Promise<{ token: string }> };

const DEMO_RESERVATION = {
  id: "DEMO", carId: "1",
  clientFirstName: "Youssef", clientLastName: "El Amrani",
  clientEmail: "test@eson-maroc.com", clientPhone: "+212666000000",
  pickupDate: "2026-03-18", dropoffDate: "2026-03-21",
  pickupLocation: "Aéroport de Ouarzazate", dropoffLocation: "Centre-ville Ouarzazate",
  pickupTime: "10:00", dropoffTime: "18:00",
  totalPrice: 1050, deliveryFee: 150, recoveryFee: 0,
  durationDays: 3, status: "pending", message: "",
  createdAt: new Date().toISOString(),
};

/** GET — vérifie le token et retourne la réservation */
export async function GET(_req: Request, { params }: Params) {
  const { token } = await params;
  const reservationId = await verifyPortalToken(decodeURIComponent(token));
  if (!reservationId) return NextResponse.json({ error: "Lien invalide ou expiré." }, { status: 403 });

  // Mode démo — pas de lecture fichier
  if (reservationId.startsWith("DEMO")) {
    return NextResponse.json({ reservation: { ...DEMO_RESERVATION, id: reservationId }, carName: "Dacia Duster 2023" });
  }

  const reservation = getServerReservationById(reservationId);
  if (!reservation) return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });

  const car = CARS.find(c => c.id === reservation.carId);
  return NextResponse.json({ reservation, carName: car ? `${car.brand} ${car.name}` : "Véhicule" });
}

/** PATCH — modifie la réservation */
export async function PATCH(req: Request, { params }: Params) {
  const { token } = await params;
  const reservationId = await verifyPortalToken(decodeURIComponent(token));
  if (!reservationId) return NextResponse.json({ error: "Lien invalide." }, { status: 403 });

  // Mode démo
  if (reservationId.startsWith("DEMO")) {
    return NextResponse.json({ ok: true, reservation: { ...DEMO_RESERVATION, id: reservationId, status: "modified" } });
  }

  const current = getServerReservationById(reservationId);
  if (!current) return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  if (current.status === "cancelled") return NextResponse.json({ error: "Réservation déjà annulée." }, { status: 400 });

  const body = await req.json();
  const allowedFields = ["pickupDate", "dropoffDate", "pickupLocation", "dropoffLocation", "pickupTime", "dropoffTime", "message"];
  const updates: Record<string, string> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) updates[field] = body[field];
  }

  // Calculer les changements pour l'email
  const changes: Record<string, { before: string; after: string }> = {};
  const labels: Record<string, string> = {
    pickupDate: "Date livraison", dropoffDate: "Date récupération",
    pickupLocation: "Lieu livraison", dropoffLocation: "Lieu récupération",
    pickupTime: "Heure livraison", dropoffTime: "Heure récupération",
  };
  for (const [k, v] of Object.entries(updates)) {
    const before = (current as Record<string, unknown>)[k] as string ?? "";
    if (before !== v && labels[k]) changes[labels[k]] = { before, after: v as string };
  }

  const updated = updateServerReservation(reservationId, updates);
  if (!updated) return NextResponse.json({ error: "Erreur mise à jour." }, { status: 500 });

  const car = CARS.find(c => c.id === current.carId);
  const clientName = `${current.clientFirstName} ${current.clientLastName}`;
  const portalToken = await createPortalToken(reservationId);

  await sendClientModificationConfirm({ clientName, clientEmail: current.clientEmail, reservationId, changes, portalToken });

  return NextResponse.json({ ok: true, reservation: updated });
}

/** DELETE — annule la réservation */
export async function DELETE(req: Request, { params }: Params) {
  const { token } = await params;
  const reservationId = await verifyPortalToken(decodeURIComponent(token));
  if (!reservationId) return NextResponse.json({ error: "Lien invalide." }, { status: 403 });

  // Mode démo
  if (reservationId.startsWith("DEMO")) {
    return NextResponse.json({ ok: true, reservation: { ...DEMO_RESERVATION, id: reservationId, status: "cancelled" } });
  }

  const current = getServerReservationById(reservationId);
  if (!current) return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  if (current.status === "cancelled") return NextResponse.json({ error: "Déjà annulée." }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const updated = updateServerReservation(reservationId, { status: "cancelled" });

  const car = CARS.find(c => c.id === current.carId);
  const clientName = `${current.clientFirstName} ${current.clientLastName}`;
  const carName = car ? `${car.brand} ${car.name}` : "Véhicule";

  await sendClientCancellationConfirm({ clientName, clientEmail: current.clientEmail, reservationId, carName });

  return NextResponse.json({ ok: true, reservation: updated });
}
