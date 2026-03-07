"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CARS, Reservation } from "@/lib/data";
import { getMergedReservations, updateReservationStatus } from "@/lib/store";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";

export default function AdminReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  useEffect(() => {
    if (!sessionStorage.getItem("admin_token")) {
      router.push("/admin/login");
      return;
    }
    setReservations(getMergedReservations());
  }, [router]);

  const filtered = filter === "all" ? reservations : reservations.filter((r) => r.status === filter);

  const changeStatus = (id: string, status: "confirmed" | "cancelled") => {
    updateReservationStatus(id, status);
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const statusStyle = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const statusLabel = { pending: "En attente", confirmed: "Confirme", cancelled: "Annule" };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0d0d1a] text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white">
          <ArrowLeft size={18} />
          Dashboard
        </Link>
        <h1 className="text-lg font-bold ml-2">Réservations</h1>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === s ? "bg-[#e63946] text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-[#e63946]"
              }`}
            >
              {s === "all" ? "Toutes" : statusLabel[s]}
              <span className="ml-2 text-xs opacity-70">
                ({s === "all" ? reservations.length : reservations.filter((r) => r.status === s).length})
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
            <p className="text-gray-400">Aucune réservation trouvée</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Client", "Voiture", "Lieu départ → retour", "Dates", "Durée", "Total", "Statut", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((r) => {
                    const car = CARS.find((c) => c.id === r.carId);
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-sm text-[#1a1a2e]">{r.clientFirstName} {r.clientLastName}</p>
                          <p className="text-xs text-gray-400">{r.clientPhone}</p>
                          <p className="text-xs text-gray-400">{r.clientEmail}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-[#1a1a2e]">{car ? `${car.brand} ${car.name}` : r.carId}</p>
                          <p className="text-xs text-gray-400">{car?.pricePerDay} DH/j</p>
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-500 max-w-[180px]">
                          <p className="truncate">{r.pickupLocation}</p>
                          <p className="truncate text-gray-400">→ {r.dropoffLocation}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                          <p>{r.pickupDate}</p>
                          <p className="text-gray-400">→ {r.dropoffDate}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">{r.durationDays}j</td>
                        <td className="px-4 py-4">
                          <span className="font-bold text-[#1a1a2e] whitespace-nowrap">{r.totalPrice} DH</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyle[r.status]}`}>
                            {statusLabel[r.status]}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {r.status === "pending" && (
                              <>
                                <button onClick={() => changeStatus(r.id, "confirmed")} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors" title="Confirmer">
                                  <CheckCircle size={16} />
                                </button>
                                <button onClick={() => changeStatus(r.id, "cancelled")} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="Annuler">
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
