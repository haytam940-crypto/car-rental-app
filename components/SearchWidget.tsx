"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Clock, Search, Phone } from "lucide-react";
import { LOCATIONS } from "@/lib/data";

export default function SearchWidget({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "09:00",
    dropoffDate: "",
    dropoffTime: "09:00",
  });
  const [error, setError] = useState("");

  const times = Array.from({ length: 48 }, (_, i) => {
    const h = Math.floor(i / 2).toString().padStart(2, "0");
    const m = i % 2 === 0 ? "00" : "30";
    return `${h}:${m}`;
  });

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
      setError("La date de retour doit etre après la date de départ.");
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

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${compact ? "" : "border border-gray-100"}`}
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${compact ? "" : "border-b border-gray-100"}`}>
        {/* Pick-up Location */}
        <div className="p-4 border-b md:border-b-0 md:border-r border-gray-100">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <MapPin size={12} className="text-[#e63946]" />
            Lieu de départ
          </label>
          <select
            value={form.pickupLocation}
            onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
            className="w-full text-sm text-[#1a1a2e] font-medium bg-transparent outline-none cursor-pointer"
          >
            <option value="">Choisir un lieu...</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Drop-off Location */}
        <div className="p-4 border-b md:border-b-0 md:border-r border-gray-100">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <MapPin size={12} className="text-[#e63946]" />
            Lieu de retour
          </label>
          <select
            value={form.dropoffLocation}
            onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })}
            className="w-full text-sm text-[#1a1a2e] font-medium bg-transparent outline-none cursor-pointer"
          >
            <option value="">Choisir un lieu...</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Pick-up Date */}
        <div className="p-4 border-b md:border-b-0 md:border-r border-gray-100">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <Calendar size={12} className="text-[#e63946]" />
            Date de départ
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              min={today}
              value={form.pickupDate}
              onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
              className="flex-1 text-sm text-[#1a1a2e] font-medium bg-transparent outline-none"
            />
            <div className="flex items-center gap-1">
              <Clock size={11} className="text-gray-400" />
              <select
                value={form.pickupTime}
                onChange={(e) => setForm({ ...form, pickupTime: e.target.value })}
                className="text-xs text-gray-500 bg-transparent outline-none"
              >
                {times.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Drop-off Date */}
        <div className="p-4">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <Calendar size={12} className="text-[#e63946]" />
            Date de retour
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              min={form.pickupDate || today}
              value={form.dropoffDate}
              onChange={(e) => setForm({ ...form, dropoffDate: e.target.value })}
              className="flex-1 text-sm text-[#1a1a2e] font-medium bg-transparent outline-none"
            />
            <div className="flex items-center gap-1">
              <Clock size={11} className="text-gray-400" />
              <select
                value={form.dropoffTime}
                onChange={(e) => setForm({ ...form, dropoffTime: e.target.value })}
                className="text-xs text-gray-500 bg-transparent outline-none"
              >
                {times.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-600 text-xs border-b border-red-100">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          className="flex-1 bg-[#e63946] text-white py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-[#c1121f] transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200"
        >
          <Search size={16} />
          Rechercher un véhicule
        </button>
        <a
          href="tel:+212600000000"
          className="flex items-center justify-center gap-2 bg-[#1a1a2e] text-white py-3.5 px-6 rounded-xl font-semibold text-sm hover:bg-[#2d2d4a] transition-colors"
        >
          <Phone size={16} />
          Contact rapide
        </a>
      </div>
    </form>
  );
}
