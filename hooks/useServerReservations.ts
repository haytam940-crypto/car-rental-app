"use client";
import { useEffect, useState, useCallback } from "react";
import { Reservation } from "@/lib/data";

export function useServerReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/reservations/list");
      const data = await res.json();
      setReservations(data.reservations ?? []);
    } catch {
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { reservations, loading, refresh };
}
