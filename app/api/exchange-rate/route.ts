import { NextResponse } from "next/server";

// Cache server-side pour éviter les appels répétés
let cached: { rate: number; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure

export async function GET() {
  // Retourner le cache si encore valide
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json({ rate: cached.rate, cached: true });
  }

  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=EUR&to=MAD", {
      next: { revalidate: 3600 }, // cache Next.js 1h
    });
    const data = await res.json();
    const rate: number = data?.rates?.MAD;

    if (rate && !isNaN(rate)) {
      cached = { rate, timestamp: Date.now() };
      return NextResponse.json({ rate, cached: false });
    }
  } catch {
    // Fallback si l'API est indisponible
  }

  // Taux de secours (taux moyen EUR/MAD)
  return NextResponse.json({ rate: 10.9, cached: false, fallback: true });
}
