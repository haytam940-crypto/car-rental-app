import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { Car, CARS } from "@/lib/data";

type Row = Record<string, unknown>;

function rowToCar(r: Row): Car {
  return {
    id:           String(r.id),
    name:         String(r.name),
    brand:        String(r.brand),
    pricePerDay:  Number(r.price_per_day),
    discount:     r.discount != null ? Number(r.discount) : undefined,
    fuelType:     String(r.fuel_type)    as Car["fuelType"],
    transmission: String(r.transmission) as Car["transmission"],
    description:  String(r.description  ?? ""),
    images:       (r.images as string[]) ?? [],
    status:       "available"            as Car["status"],
    year:         Number(r.year),
    seats:        Number(r.seats),
    doors:        Number(r.doors),
    category:     String(r.category      ?? ""),
  };
}

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM cars ORDER BY id` as Row[];
    const cars = rows.length > 0 ? rows.map(rowToCar) : CARS;
    return NextResponse.json({ cars });
  } catch (e) {
    console.error("[api/catalog] GET error:", e);
    // Fallback to static cars if DB unavailable
    return NextResponse.json({ cars: CARS });
  }
}
