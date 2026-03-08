"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import MIcon from "@/components/MIcon";
import { getStoredCars } from "@/lib/store";
import { CARS } from "@/lib/data";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CATEGORIES = ["Tous", "Économique", "Citadine", "Compacte", "SUV", "Luxe"];
const FUELS = ["Tous", "Essence", "Diesel", "Hybride", "Electrique"];
const TRANSMISSIONS = ["Toutes", "Automatique", "Manuelle"];

function FleetContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [cars, setCars] = useState(CARS);
  useEffect(() => { setCars(getStoredCars()); }, []);

  const urlFrom = searchParams.get("from") || "";
  const urlTo = searchParams.get("to") || "";
  const urlPickup = searchParams.get("pickup") || "";
  const urlDropoff = searchParams.get("dropoff") || "";
  const urlCategory = searchParams.get("category") || "";

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

  const filtered = cars.filter((car) => {
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

  const filterBtnCls = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
      active
        ? "bg-[#D4A96A] text-black"
        : "bg-white/5 text-gray-400 border border-white/10 hover:border-[#D4A96A]/40 hover:text-white"
    }`;

  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Header />

      {/* Page Header */}
      <section className="pt-28 pb-14 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#0a0a0a]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <p className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest mb-3">{t("fleet.title")}</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">{t("fleet.sub")}</h1>
          <p className="text-gray-400">
            {cars.filter((c) => c.status === "available").length} {t("fleet.available")}
          </p>

          {urlFrom && urlTo && (
            <div className="inline-flex items-center gap-2 mt-5 bg-[#D4A96A]/10 border border-[#D4A96A]/30 text-[#D4A96A] px-4 py-2 rounded-full text-sm font-medium">
              <MIcon name="calendar_month" size={15} />
              {urlFrom} → {urlTo}
              {urlPickup && <span className="text-gray-400 ml-1">· {urlPickup.split(" | ")[0]}</span>}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters sidebar — desktop */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white text-sm uppercase tracking-widest">{t("fleet.filters")}</h3>
                <button onClick={resetFilters} className="text-xs text-[#D4A96A] hover:underline">
                  {t("fleet.resetFilters")}
                </button>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Catégorie</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button key={c} onClick={() => setCategory(c)} className={filterBtnCls(category === c)}>{c}</button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Carburant</p>
                <div className="flex flex-wrap gap-2">
                  {FUELS.map((f) => (
                    <button key={f} onClick={() => setFuel(f)} className={filterBtnCls(fuel === f)}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Boîte</p>
                <div className="flex flex-wrap gap-2">
                  {TRANSMISSIONS.map((t) => (
                    <button key={t} onClick={() => setTransmission(t)} className={filterBtnCls(transmission === t)}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Prix max/jour</p>
                  <span className="text-sm font-bold text-[#D4A96A]">{maxPrice} DH</span>
                </div>
                <input
                  type="range" min={200} max={1000} step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#D4A96A]"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>200 DH</span>
                  <span>1000 DH</span>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#D4A96A]"
                />
                <span className="text-sm text-gray-400">{t("fleet.availableOnly")}</span>
              </label>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Mobile top bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500 text-sm">{filtered.length} {t("fleet.results")}</p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium hover:border-[#D4A96A]/40 transition-colors"
              >
                <SlidersHorizontal size={15} className="text-[#D4A96A]" />
                {t("fleet.filters")}
              </button>
            </div>

            {/* Car grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-white/5 border border-white/8 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Search size={32} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t("fleet.noResults")}</h3>
                <p className="text-gray-500 mb-6">{t("fleet.noResultsSub")}</p>
                <button onClick={resetFilters} className="yellow-btn px-6 py-3 rounded-xl font-semibold">
                  {t("home.featured.seeAll")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((car) => (
                  <CarCard key={car.id} car={car} linkSuffix={carLinkSuffix} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters panel */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70" onClick={() => setShowFilters(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-80 bg-[#111111] border-l border-white/8 p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white">{t("fleet.filters")}</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Catégorie</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={filterBtnCls(category === c)}>{c}</button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Carburant</p>
              <div className="flex flex-wrap gap-2">
                {FUELS.map((f) => (
                  <button key={f} onClick={() => setFuel(f)} className={filterBtnCls(fuel === f)}>{f}</button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Boîte</p>
              <div className="flex flex-wrap gap-2">
                {TRANSMISSIONS.map((t) => (
                  <button key={t} onClick={() => setTransmission(t)} className={filterBtnCls(transmission === t)}>{t}</button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="w-4 h-4 accent-[#D4A96A]"
              />
              <span className="text-sm text-gray-400">{t("fleet.availableOnly")}</span>
            </label>
            <button
              onClick={() => { resetFilters(); setShowFilters(false); }}
              className="w-full mt-6 border border-white/10 py-2 rounded-xl text-sm text-gray-400 hover:border-[#D4A96A]/40 hover:text-white transition-colors"
            >
              {t("fleet.resetFilters")}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

export default function FleetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Chargement...</div>}>
      <FleetContent />
    </Suspense>
  );
}
