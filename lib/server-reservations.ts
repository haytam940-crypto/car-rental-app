/**
 * Store serveur côté Node.js — fichier JSON dans /data/reservations.json.
 * Permet la synchronisation entre le portail client et le dashboard admin.
 */

import fs from "fs";
import path from "path";
import { Reservation } from "./data";

// Stocké dans le répertoire HOME pour survivre aux déploiements
const DATA_DIR = process.env.RESERVATIONS_PATH
  || path.join(process.env.HOME || "/tmp", "eson_data");
const DATA_FILE = path.join(DATA_DIR, "reservations.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ reservations: [] }));
}

export function getAllServerReservations(): Reservation[] {
  ensureFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw).reservations ?? [];
  } catch {
    return [];
  }
}

export function getServerReservationById(id: string): Reservation | null {
  return getAllServerReservations().find(r => r.id === id) ?? null;
}

export function saveServerReservation(reservation: Reservation): void {
  ensureFile();
  const all = getAllServerReservations();
  const idx = all.findIndex(r => r.id === reservation.id);
  if (idx >= 0) {
    all[idx] = reservation;
  } else {
    all.push(reservation);
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify({ reservations: all }, null, 2));
}

export function updateServerReservation(id: string, updates: Partial<Reservation>): Reservation | null {
  const all = getAllServerReservations();
  const idx = all.findIndex(r => r.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates };
  fs.writeFileSync(DATA_FILE, JSON.stringify({ reservations: all }, null, 2));
  return all[idx];
}
