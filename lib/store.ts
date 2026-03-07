import { Reservation, RESERVATIONS } from "./data";

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

export function getMergedReservations(): Reservation[] {
  const stored = getStoredReservations();
  const storedIds = new Set(stored.map((r) => r.id));
  const merged = [...stored, ...RESERVATIONS.filter((r) => !storedIds.has(r.id))];
  return merged.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
  const stored = getStoredReservations();
  const storedIds = new Set(stored.map((r) => r.id));

  if (storedIds.has(id)) {
    // Réservation déjà dans localStorage — mise à jour directe
    const updated = stored.map((r) => (r.id === id ? { ...r, status } : r));
    localStorage.setItem(KEY, JSON.stringify(updated));
  } else {
    // Réservation statique — on la copie dans localStorage avec le nouveau statut
    const staticRes = RESERVATIONS.find((r) => r.id === id);
    if (staticRes) {
      localStorage.setItem(KEY, JSON.stringify([...stored, { ...staticRes, status }]));
    }
  }
}
