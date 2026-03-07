import Link from "next/link";
import { Fuel, Settings, Users, ArrowRight } from "lucide-react";
import { Car } from "@/lib/data";

export default function CarCard({ car, linkSuffix = "" }: { car: Car; linkSuffix?: string }) {
  const statusColor = {
    available: "bg-green-100 text-green-700",
    rented: "bg-red-100 text-red-700",
    maintenance: "bg-yellow-100 text-yellow-700",
  }[car.status];

  const statusLabel = {
    available: "Disponible",
    rented: "Loue",
    maintenance: "Maintenance",
  }[car.status];

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={car.images[0]}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-[#1a1a2e]/80 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
            {car.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColor}`}>
            {statusLabel}
          </span>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 right-3 bg-[#e63946] text-white px-3 py-1.5 rounded-xl">
          <span className="text-lg font-black">{car.pricePerDay}</span>
          <span className="text-xs ml-1">DH/jour</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{car.brand}</p>
          <h3 className="text-xl font-bold text-[#1a1a2e]">{car.name}</h3>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
          <span className="flex items-center gap-1.5">
            <Fuel size={13} className="text-[#e63946]" />
            {car.fuelType}
          </span>
          <span className="flex items-center gap-1.5">
            <Settings size={13} className="text-[#e63946]" />
            {car.transmission}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-[#e63946]" />
            {car.seats} places
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/cars/${car.id}${linkSuffix}`}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
            car.status === "available"
              ? "bg-[#1a1a2e] text-white hover:bg-[#e63946]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
          }`}
        >
          {car.status === "available" ? (
            <>Voir les details <ArrowRight size={15} /></>
          ) : (
            "Indisponible"
          )}
        </Link>
      </div>
    </div>
  );
}
