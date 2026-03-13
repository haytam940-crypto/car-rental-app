"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Fuel, Settings, Users, ArrowRight } from "lucide-react";
import { Car } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";
import { getActivePromotion } from "@/lib/store";
import { useExchangeRate } from "@/hooks/useExchangeRate";

export default function CarCard({ car, linkSuffix = "" }: { car: Car; linkSuffix?: string }) {
  const { t } = useLanguage();
  const { toEur } = useExchangeRate();
  const [globalDiscount, setGlobalDiscount] = useState(0);

  useEffect(() => {
    const promo = getActivePromotion();
    if (promo && (promo.applyTo === "cars" || promo.applyTo === "all")) {
      setGlobalDiscount(promo.discountPercent);
    }
  }, []);

  const isAvailable = car.status === "available";
  // Per-car discount takes priority over global promo
  const effectiveDiscount = (car.discount && car.discount > 0) ? car.discount : globalDiscount;
  const hasPromo = effectiveDiscount > 0;
  const isGlobalPromo = hasPromo && !(car.discount && car.discount > 0);
  const htPrice = hasPromo ? Math.round(car.pricePerDay * (1 - effectiveDiscount / 100)) : car.pricePerDay;
  const ttcPrice = Math.round(htPrice * 1.2);
  const originalHT = car.pricePerDay;

  const statusLabel = car.status === "available"
    ? t("car.available")
    : car.status === "rented"
    ? t("car.rented")
    : t("car.maintenance");

  return (
    <div className="card-dark group overflow-hidden">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#1a1a1a]">
        <img
          src={car.images[0]}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {hasPromo && (
          <div className={`absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-md ${isGlobalPromo ? "bg-green-400 text-black" : "bg-[#D4A96A] text-black"}`}>
            -{effectiveDiscount}%{isGlobalPromo && " PROMO"}
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm ${
            isAvailable
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}>
            {statusLabel}
          </span>
        </div>

        <div className="absolute bottom-3 left-3">
          <span className="text-xs text-white/70 font-medium uppercase tracking-wider">
            {car.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-4">
          <p className="text-xs text-[#D4A96A] font-semibold uppercase tracking-widest mb-1">{car.brand}</p>
          <h3 className="text-lg font-bold text-white">{car.name}
            <span className="text-sm font-normal text-gray-500 ml-2">{car.year}</span>
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-5 pb-4 border-b border-white/8">
          <span className="flex items-center gap-1.5">
            <Fuel size={13} className="text-[#D4A96A]" />
            {car.fuelType}
          </span>
          <span className="flex items-center gap-1.5">
            <Settings size={13} className="text-[#D4A96A]" />
            {car.transmission}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-[#D4A96A]" />
            {car.seats} {t("car.seats")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {hasPromo && (
              <div className="text-xs text-gray-500 line-through">{originalHT} DH HT/j</div>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#D4A96A]">{htPrice}</span>
              <span className="text-xs text-gray-400 font-medium">DH HT/j</span>
            </div>
            <div className="text-[11px] text-gray-600 mt-0.5">{ttcPrice} DH TTC</div>
            {toEur(htPrice) && (
              <div className="text-[11px] text-gray-500 mt-0.5">
                ≈ <span className="text-white/60 font-semibold">{toEur(htPrice)} €</span>/j
              </div>
            )}
          </div>
          <Link
            href={isAvailable ? `/cars/${car.id}${linkSuffix}` : "#"}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isAvailable
                ? "yellow-btn"
                : "bg-white/5 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isAvailable ? (
              <>{t("car.book")} <ArrowRight size={14} /></>
            ) : (
              t("car.unavailable")
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
