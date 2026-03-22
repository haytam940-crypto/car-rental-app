import { Reservation, RESERVATIONS, Car, CARS, CarCharge, ExcursionBooking, EXCURSION_BOOKINGS, Excursion, EXCURSIONS, Promotion, DeliveryFeeEntry, DEFAULT_DELIVERY_FEES } from "./data";

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

// ─── Cars ────────────────────────────────────────────────────────────────────

const CARS_KEY = "autoloc_cars";
const CARS_VERSION_KEY = "autoloc_cars_version";
const CARS_VERSION = "v2"; // bump this when CARS in data.ts changes

export function getStoredCars(): Car[] {
  if (typeof window === "undefined") return CARS;
  try {
    // If data version changed, clear old cache so new cars from data.ts are used
    if (localStorage.getItem(CARS_VERSION_KEY) !== CARS_VERSION) {
      localStorage.removeItem(CARS_KEY);
      localStorage.setItem(CARS_VERSION_KEY, CARS_VERSION);
    }
    const raw = localStorage.getItem(CARS_KEY);
    return raw ? JSON.parse(raw) : CARS;
  } catch {
    return CARS;
  }
}

export function saveCar(car: Car): void {
  if (typeof window === "undefined") return;
  const existing = getStoredCars();
  const idx = existing.findIndex((c) => c.id === car.id);
  const updated = idx >= 0
    ? existing.map((c) => (c.id === car.id ? car : c))
    : [...existing, car];
  localStorage.setItem(CARS_KEY, JSON.stringify(updated));
}

export function deleteCar(id: string): void {
  if (typeof window === "undefined") return;
  const updated = getStoredCars().filter((c) => c.id !== id);
  localStorage.setItem(CARS_KEY, JSON.stringify(updated));
}

// ─── Reservations ────────────────────────────────────────────────────────────

// ─── Charges ─────────────────────────────────────────────────────────────────

const CHARGES_KEY = "autoloc_charges";

export function getStoredCharges(): CarCharge[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHARGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveCharge(charge: CarCharge): void {
  if (typeof window === "undefined") return;
  const existing = getStoredCharges();
  const idx = existing.findIndex((c) => c.id === charge.id);
  const updated = idx >= 0
    ? existing.map((c) => (c.id === charge.id ? charge : c))
    : [...existing, charge];
  localStorage.setItem(CHARGES_KEY, JSON.stringify(updated));
}

export function deleteCharge(id: string): void {
  if (typeof window === "undefined") return;
  const updated = getStoredCharges().filter((c) => c.id !== id);
  localStorage.setItem(CHARGES_KEY, JSON.stringify(updated));
}

// ─── Reservations ────────────────────────────────────────────────────────────

// ─── Excursion Bookings ───────────────────────────────────────────────────────

const EXCURSION_BOOKINGS_KEY = "eson_excursion_bookings";

export function getStoredExcursionBookings(): ExcursionBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EXCURSION_BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function getMergedExcursionBookings(): ExcursionBooking[] {
  const stored = getStoredExcursionBookings();
  const storedIds = new Set(stored.map((b) => b.id));
  const merged = [...stored, ...EXCURSION_BOOKINGS.filter((b) => !storedIds.has(b.id))];
  return merged.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveExcursionBooking(booking: ExcursionBooking): void {
  if (typeof window === "undefined") return;
  const existing = getStoredExcursionBookings();
  localStorage.setItem(EXCURSION_BOOKINGS_KEY, JSON.stringify([...existing, booking]));
}

export function updateExcursionBookingStatus(
  id: string,
  status: "confirmed" | "cancelled"
): void {
  if (typeof window === "undefined") return;
  const stored = getStoredExcursionBookings();
  const storedIds = new Set(stored.map((b) => b.id));
  if (storedIds.has(id)) {
    const updated = stored.map((b) => (b.id === id ? { ...b, status } : b));
    localStorage.setItem(EXCURSION_BOOKINGS_KEY, JSON.stringify(updated));
  } else {
    const staticB = EXCURSION_BOOKINGS.find((b) => b.id === id);
    if (staticB) {
      localStorage.setItem(EXCURSION_BOOKINGS_KEY, JSON.stringify([...stored, { ...staticB, status }]));
    }
  }
}

// ─── Excursion Packages (CRUD) ────────────────────────────────────────────────

const CUSTOM_EXCURSIONS_KEY = "eson_custom_excursions";
const DELETED_EXCURSIONS_KEY = "eson_deleted_excursions";
const EXCURSIONS_VERSION_KEY = "eson_excursions_version";
const EXCURSIONS_VERSION = "v2"; // bump quand EXCURSIONS dans data.ts change

function getDeletedExcursionIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(DELETED_EXCURSIONS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

export function getCustomExcursions(): Excursion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_EXCURSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function getMergedExcursions(): Excursion[] {
  if (typeof window !== "undefined") {
    if (localStorage.getItem(EXCURSIONS_VERSION_KEY) !== EXCURSIONS_VERSION) {
      localStorage.removeItem(CUSTOM_EXCURSIONS_KEY);
      localStorage.removeItem(DELETED_EXCURSIONS_KEY);
      localStorage.setItem(EXCURSIONS_VERSION_KEY, EXCURSIONS_VERSION);
    }
  }
  const custom = getCustomExcursions();
  const customIds = new Set(custom.map(e => e.id));
  const deletedIds = getDeletedExcursionIds();
  return [
    ...custom,
    ...EXCURSIONS.filter(e => !customIds.has(e.id) && !deletedIds.has(e.id)),
  ];
}

export function saveExcursion(exc: Excursion): void {
  if (typeof window === "undefined") return;
  const existing = getCustomExcursions();
  const idx = existing.findIndex(e => e.id === exc.id);
  const updated = idx >= 0
    ? existing.map(e => e.id === exc.id ? exc : e)
    : [...existing, exc];
  localStorage.setItem(CUSTOM_EXCURSIONS_KEY, JSON.stringify(updated));
}

export function deleteExcursion(id: string): void {
  if (typeof window === "undefined") return;
  const updatedCustom = getCustomExcursions().filter(e => e.id !== id);
  localStorage.setItem(CUSTOM_EXCURSIONS_KEY, JSON.stringify(updatedCustom));
  if (EXCURSIONS.some(e => e.id === id)) {
    const deleted = getDeletedExcursionIds();
    deleted.add(id);
    localStorage.setItem(DELETED_EXCURSIONS_KEY, JSON.stringify([...deleted]));
  }
}

// ─── Promotions ───────────────────────────────────────────────────────────────

const PROMOTIONS_KEY = "eson_promotions";

export function getStoredPromotions(): Promotion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROMOTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function savePromotion(promo: Promotion): void {
  if (typeof window === "undefined") return;
  const existing = getStoredPromotions();
  const idx = existing.findIndex(p => p.id === promo.id);
  const updated = idx >= 0
    ? existing.map(p => p.id === promo.id ? promo : p)
    : [...existing, promo];
  localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(updated));
}

export function deletePromotion(id: string): void {
  if (typeof window === "undefined") return;
  const updated = getStoredPromotions().filter(p => p.id !== id);
  localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(updated));
}

export function getActivePromotion(today?: string): Promotion | null {
  const date = today || new Date().toISOString().split("T")[0];
  const promos = getStoredPromotions();
  return promos.find(p => p.active && p.startDate <= date && p.endDate >= date) ?? null;
}

// ─── Delivery Fees Grid ───────────────────────────────────────────────────────

const DELIVERY_FEES_KEY = "eson_delivery_fees";

export function getDeliveryFees(): DeliveryFeeEntry[] {
  if (typeof window === "undefined") return DEFAULT_DELIVERY_FEES;
  try {
    const raw = localStorage.getItem(DELIVERY_FEES_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_DELIVERY_FEES;
  } catch { return DEFAULT_DELIVERY_FEES; }
}

export function saveDeliveryFees(fees: DeliveryFeeEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DELIVERY_FEES_KEY, JSON.stringify(fees));
}

// ─── Reservations status ──────────────────────────────────────────────────────

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
