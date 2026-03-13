"use client";
import { useState, useEffect } from "react";

export function useExchangeRate() {
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/exchange-rate")
      .then((r) => r.json())
      .then((d) => { if (d?.rate) setRate(d.rate); })
      .catch(() => setRate(10.9));
  }, []);

  // Convertit un montant DH → EUR (arrondi)
  const toEur = (dh: number) =>
    rate ? Math.round(dh / rate) : null;

  return { rate, toEur };
}
