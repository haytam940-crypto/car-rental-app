import fs from "fs";
import path from "path";

export interface DevisItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Devis {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  type: "location" | "excursion";

  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;

  // Location voiture
  carId?: string;
  carName?: string;
  pickupDate?: string;
  dropoffDate?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  pickupTime?: string;
  dropoffTime?: string;
  durationDays?: number;

  // Excursion
  destination?: string;
  excursionDate?: string;
  participants?: number;

  items: DevisItem[];
  subtotal: number;
  discount: number;
  total: number;

  notes?: string;
  validUntil?: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "devis.json");

function readAll(): Devis[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw).devis ?? [];
  } catch {
    return [];
  }
}

function writeAll(devis: Devis[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify({ devis }, null, 2), "utf-8");
}

export function getAllDevis(): Devis[] {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getDevisById(id: string): Devis | null {
  return readAll().find(d => d.id === id) ?? null;
}

export function saveDevis(devis: Devis): void {
  const all = readAll();
  const idx = all.findIndex(d => d.id === devis.id);
  if (idx >= 0) all[idx] = devis;
  else all.push(devis);
  writeAll(all);
}

export function updateDevis(id: string, updates: Partial<Devis>): Devis | null {
  const all = readAll();
  const idx = all.findIndex(d => d.id === id);
  if (idx < 0) return null;
  all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
  writeAll(all);
  return all[idx];
}

export function deleteDevis(id: string): boolean {
  const all = readAll();
  const filtered = all.filter(d => d.id !== id);
  if (filtered.length === all.length) return false;
  writeAll(filtered);
  return true;
}
