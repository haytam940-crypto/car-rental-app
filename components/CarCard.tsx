import Link from "next/link";
import { Fuel, Settings, Users, ArrowRight, Star } from "lucide-react";
import { Car } from "@/lib/data";

export default function CarCard({ car, linkSuffix = "" }: { car: Car; linkSuffix?: string }) {
  const isAvailable = car.status === "available";
  const hasPromo = car.discount && car.discount > 0;
  const discountedPrice = hasPromo
    ? Math.round(car.pricePerDay * (1 - car.discount! / 100))
    : car.pricePerDay;

  return (
    <div className="card-dark group overflow-hidden">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#1a1a1a]">
        <img
          src={car.images[0]}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Promo badge */}
        {hasPromo && (
          <div className="absolute top-3 left-3 bg-[#F5C518] text-black text-xs font-black px-2.5 py-1 rounded-md">
            -{car.discount}%
          </div>
        )}

        {/* Status */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm ${
            isAvailable
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}>
            {isAvailable ? "Disponible" : car.status === "rented" ? "Loué" : "Maintenance"}
          </span>
        </div>

        {/* Category */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs text-white/70 font-medium uppercase tracking-wider">
            {car.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Brand + Name */}
        <div className="mb-4">
          <p className="text-xs text-[#F5C518] font-semibold uppercase tracking-widest mb-1">{car.brand}</p>
          <h3 className="text-lg font-bold text-white">{car.name}
            <span className="text-sm font-normal text-gray-500 ml-2">{car.year}</span>
          </h3>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-5 pb-4 border-b border-white/8">
          <span className="flex items-center gap-1.5">
            <Fuel size={13} className="text-[#F5C518]" />
            {car.fuelType}
          </span>
          <span className="flex items-center gap-1.5">
            <Settings size={13} className="text-[#F5C518]" />
            {car.transmission}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-[#F5C518]" />
            {car.seats} pl.
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            {hasPromo && (
              <div className="text-xs text-gray-500 line-through">{car.pricePerDay} DH/j</div>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#F5C518]">{discountedPrice}</span>
              <span className="text-xs text-gray-400 font-medium">DH/jour</span>
            </div>
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
              <>Réserver <ArrowRight size={14} /></>
            ) : (
              "Indisponible"
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
