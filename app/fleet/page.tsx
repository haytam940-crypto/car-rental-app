"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import MIcon from "@/components/MIcon";
import { CARS } from "@/lib/data";
import { SlidersHorizontal, X } from "lucide-react";

const CATEGORIES = ["Tous", "Économique", "Citadine", "Compacte", "SUV", "Luxe"];
const FUELS = ["Tous", "Essence", "Diesel", "Hybride", "Electrique"];
const TRANSMISSIONS = ["Toutes", "Automatique", "Manuelle"];

function FleetContent() {
  const searchParams = useSearchParams();

  // Dates transmises depuis le SearchWidget
  const urlFrom = searchParams.get("from") || "";
  const urlTo = searchParams.get("to") || "";
  const urlPickup = searchParams.get("pickup") || "";
  const urlDropoff = searchParams.get("dropoff") || "";
  const urlCategory = searchParams.get("category") || "";

  // Construire les params a passer aux pages detail
  const carLinkParams = new URLSearchParams();
  if (urlFrom) carLinkParams.set("from", urlFrom);
  if (urlTo) carLinkParams.set("to", urlTo);
  if (urlPickup) carLinkParams.set("pickup", urlPickup);
  if (urlDropoff) carLinkParams.set("dropoff", urlDropoff);
  const carLinkSuffix = carLinkParams.toString() ? `?${carLinkParams.toString()}` : "";

  const [category, setCategory] = useState(urlCategory || "Tous");
  const [fuel, setFuel] = useState("Tous");
  const [transmission, setTransmission] = useState("Toutes");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = CARS.filter((car) => {
    if (category !== "Tous" && car.category !== category) return false;
    if (fuel !== "Tous" && car.fuelType !== fuel) return false;
    if (transmission !== "Toutes" && car.transmission !== transmission) return false;
    if (car.pricePerDay > maxPrice) return false;
    if (availableOnly && car.status !== "available") return false;
    return true;
  });

  const resetFilters = () => {
    setCategory("Tous");
    setFuel("Tous");
    setTransmission("Toutes");
    setMaxPrice(1000);
    setAvailableOnly(false);
  };

  return (
    <main>
      <Header />

      {/* Page Header */}
      <section className="pt-28 pb-12 bg-[#1a1a2e] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <p className="text-[#e63946] text-sm font-semibold uppercase tracking-wider mb-2">Notre flotte</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Toutes nos voitures</h1>
          <p className="text-gray-400">{CARS.filter(c => c.status === "available").length} véhicules disponibles</p>

          {/* Rappel des dates sélectionnées */}
          {urlFrom && urlTo && (
            <div className="inline-flex items-center gap-2 mt-4 bg-[#e63946]/20 border border-[#e63946]/40 text-[#e63946] px-4 py-2 rounded-full text-sm font-medium">
              <MIcon name="calendar_month" size={16} />
              {urlFrom} → {urlTo}
              {urlPickup && <span className="text-gray-400 ml-1">· {urlPickup.split(" | ")[0]}</span>}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters sidebar — desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#1a1a2e]">Filtres</h3>
                <button onClick={resetFilters} className="text-xs text-[#e63946] hover:underline">
                  Reinitialiser
                </button>
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categorie</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === c ? "bg-[#e63946] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{c}</button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Carburant</p>
                <div className="flex flex-wrap gap-2">
                  {FUELS.map((f) => (
                    <button key={f} onClick={() => setFuel(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${fuel === f ? "bg-[#e63946] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Boite</p>
                <div className="flex flex-wrap gap-2">
                  {TRANSMISSIONS.map((t) => (
                    <button key={t} onClick={() => setTransmission(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${transmission === t ? "bg-[#e63946] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prix max/jour</p>
                  <span className="text-sm font-bold text-[#e63946]">{maxPrice} DH</span>
                </div>
                <input type="range" min={200} max={1000} step={50} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#e63946]" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>200 DH</span>
                  <span>1000 DH</span>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="w-4 h-4 accent-[#e63946]" />
                <span className="text-sm text-gray-600">Disponibles uniquement</span>
              </label>
            </div>
          </aside>

          {/* Mobile filter toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <p className="text-gray-500 text-sm">{filtered.length} véhicule(s)</p>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 bg-[#1a1a2e] text-white px-4 py-2 rounded-xl text-sm font-medium">
              <SlidersHorizontal size={16} />
              Filtres
            </button>
          </div>

          {/* Mobile filters panel */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-[#1a1a2e]">Filtres</h3>
                  <button onClick={() => setShowFilters(false)}><X size={20} /></button>
                </div>
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categorie</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${category === c ? "bg-[#e63946] text-white" : "bg-gray-100 text-gray-600"}`}>{c}</button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Carburant</p>
                  <div className="flex flex-wrap gap-2">
                    {FUELS.map((f) => (
                      <button key={f} onClick={() => setFuel(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${fuel === f ? "bg-[#e63946] text-white" : "bg-gray-100 text-gray-600"}`}>{f}</button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer mt-4">
                  <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="w-4 h-4 accent-[#e63946]" />
                  <span className="text-sm text-gray-600">Disponibles uniquement</span>
                </label>
                <button onClick={() => { resetFilters(); setShowFilters(false); }} className="w-full mt-6 border border-gray-200 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
                  Reinitialiser
                </button>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1">
            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-gray-500 text-sm">{filtered.length} véhicule(s) trouvés</p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MIcon name="search" size={36} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Aucun véhicule trouvé</h3>
                <p className="text-gray-500 mb-6">Essayez de modifier vos filtres</p>
                <button onClick={resetFilters} className="bg-[#e63946] text-white px-6 py-3 rounded-xl font-semibold">
                  Voir tous les véhicules
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((car) => (
                  <CarCard key={car.id} car={car} linkSuffix={carLinkSuffix} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function FleetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <FleetContent />
    </Suspense>
  );
}
