"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Search } from "lucide-react";
import { LOCATIONS } from "@/lib/data";

export default function SearchWidget({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    dropoffDate: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pickupLocation || !form.dropoffLocation) {
      setError("Veuillez sélectionner les lieux de prise en charge et de retour.");
      return;
    }
    if (!form.pickupDate || !form.dropoffDate) {
      setError("Veuillez sélectionner les dates.");
      return;
    }
    if (form.dropoffDate < form.pickupDate) {
      setError("La date de retour doit être après la date de départ.");
      return;
    }
    setError("");
    const params = new URLSearchParams({
      from: form.pickupDate,
      to: form.dropoffDate,
      pickup: form.pickupLocation,
      dropoff: form.dropoffLocation,
    });
    router.push(`/fleet?${params.toString()}`);
  };

  const inputCls = "w-full bg-transparent text-white text-sm font-medium outline-none placeholder-gray-500";
  const labelCls = "flex items-center gap-1.5 text-[10px] font-bold text-[#F5C518] uppercase tracking-widest mb-1.5";
  const cellCls = "p-5 border-r border-white/8 last:border-r-0";

  return (
    <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-white/8">
        <div className={cellCls}>
          <label className={labelCls}>
            <MapPin size={11} /> Lieu de départ
          </label>
          <select
            value={form.pickupLocation}
            onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
            className="w-full bg-transparent text-white text-sm font-medium outline-none cursor-pointer"
            style={{ colorScheme: "dark" }}
          >
            <option value="" className="bg-[#1a1a1a]">Choisir un lieu...</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc} className="bg-[#1a1a1a]">{loc}</option>
            ))}
          </select>
        </div>

        <div className={cellCls}>
          <label className={labelCls}>
            <MapPin size={11} /> Lieu de retour
          </label>
          <select
            value={form.dropoffLocation}
            onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })}
            className="w-full bg-transparent text-white text-sm font-medium outline-none cursor-pointer"
            style={{ colorScheme: "dark" }}
          >
            <option value="" className="bg-[#1a1a1a]">Choisir un lieu...</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc} className="bg-[#1a1a1a]">{loc}</option>
            ))}
          </select>
        </div>

        <div className={cellCls}>
          <label className={labelCls}>
            <Calendar size={11} /> Date de départ
          </label>
          <input
            type="date"
            min={today}
            value={form.pickupDate}
            onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
            className={inputCls}
            style={{ colorScheme: "dark" }}
          />
        </div>

        <div className="p-5">
          <label className={labelCls}>
            <Calendar size={11} /> Date de retour
          </label>
          <input
            type="date"
            min={form.pickupDate || today}
            value={form.dropoffDate}
            onChange={(e) => setForm({ ...form, dropoffDate: e.target.value })}
            className={inputCls}
            style={{ colorScheme: "dark" }}
          />
        </div>
      </div>

      {error && (
        <div className="px-5 py-2.5 bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      <div className="p-4">
        <button
          type="submit"
          className="w-full yellow-btn py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2"
        >
          <Search size={18} />
          Rechercher un véhicule disponible
        </button>
      </div>
    </form>
  );
}
