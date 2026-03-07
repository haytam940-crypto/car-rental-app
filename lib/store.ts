import { Reservation } from "./data";

const KEY = "autoloc_reservations";

export function getStoredReservations(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReservation(reservation: Reservation): void {
  if (typeof window === "undefined") return;
  const existing = getStoredReservations();
  localStorage.setItem(KEY, JSON.stringify([...existing, reservation]));
}

export function updateReservationStatus(
  id: string,
  status: "confirmed" | "cancelled"
): void {
  if (typeof window === "undefined") return;
  const reservations = getStoredReservations().map((r) =>
    r.id === id ? { ...r, status } : r
  );
  localStorage.setItem(KEY, JSON.stringify(reservations));
}
