"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CARS, Car } from "@/lib/data";
import { Fuel, Settings, Edit2, Trash2, Plus, ArrowLeft } from "lucide-react";

export default function AdminCarsPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>(CARS);

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("admin_token")) {
      router.push("/admin/login");
    }
  }, [router]);

  const statusStyle = {
    available: "bg-green-100 text-green-700",
    rented: "bg-red-100 text-red-700",
    maintenance: "bg-yellow-100 text-yellow-700",
  };
  const statusLabel = { available: "Disponible", rented: "Loue", maintenance: "Maintenance" };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0d0d1a] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft size={18} />
            Dashboard
          </Link>
          <h1 className="text-lg font-bold ml-2">Gestion des voitures</h1>
        </div>
        <button className="flex items-center gap-2 bg-[#e63946] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#c1121f] transition-colors">
          <Plus size={16} />
          Ajouter
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="relative h-40 bg-gray-100">
                <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
                <span className={`absolute top-2 right-2 text-xs px-2.5 py-1 rounded-full font-semibold ${statusStyle[car.status]}`}>
                  {statusLabel[car.status]}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 font-medium">{car.brand}</p>
                <h3 className="font-bold text-[#1a1a2e] mb-2">{car.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Fuel size={11} className="text-[#e63946]" />{car.fuelType}</span>
                  <span className="flex items-center gap-1"><Settings size={11} className="text-[#e63946]" />{car.transmission}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-[#e63946]">{car.pricePerDay} <span className="text-xs font-normal text-gray-400">DH/j</span></span>
                  <div className="flex gap-2">
                    <button className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                      <Edit2 size={14} />
                    </button>
                    <button className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
