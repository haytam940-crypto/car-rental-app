"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CARS, LOCATIONS, Reservation } from "@/lib/data";
import { getMergedReservations, updateReservationStatus, saveReservation, getStoredCars } from "@/lib/store";
import { CheckCircle, XCircle, ArrowLeft, Plus, X } from "lucide-react";

const TODAY = new Date().toISOString().split("T")[0];

const EMPTY_FORM = {
  clientFirstName: "", clientLastName: "", clientPhone: "",
  clientEmail: "", clientLicense: "",
  carId: "", pickupLocation: "", dropoffLocation: "",
  pickupDate: TODAY, dropoffDate: TODAY,
  status: "confirmed" as Reservation["status"],
  message: "",
};

export default function AdminReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [cars, setCars] = useState(CARS);

  useEffect(() => {
    if (!sessionStorage.getItem("admin_token")) {
      router.push("/admin/login");
      return;
    }
    setReservations(getMergedReservations());
    setCars(getStoredCars());
  }, [router]);

  const refresh = () => setReservations(getMergedReservations());

  const filtered = filter === "all" ? reservations : reservations.filter((r) => r.status === filter);

  const changeStatus = (id: string, status: "confirmed" | "cancelled") => {
    updateReservationStatus(id, status);
    refresh();
  };

  const handleAdd = () => {
    setFormError("");
    const { clientFirstName, clientLastName, clientPhone, clientLicense, carId, pickupLocation, dropoffLocation, pickupDate, dropoffDate } = form;
    if (!clientFirstName || !clientLastName || !clientPhone || !clientLicense)
      return setFormError("Veuillez remplir tous les champs client.");
    if (!carId) return setFormError("Veuillez sélectionner une voiture.");
    if (!pickupLocation || !dropoffLocation) return setFormError("Veuillez sélectionner les lieux.");
    if (dropoffDate < pickupDate) return setFormError("La date de retour doit être après la date de départ.");

    const car = cars.find((c) => c.id === carId);
    const diffDays = Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / 86400000) || 1;
    const totalPrice = diffDays * (car?.pricePerDay ?? 0);

    const reservation: Reservation = {
      id: `manual-${Date.now()}`,
      carId, clientFirstName, clientLastName, clientPhone,
      clientEmail: form.clientEmail,
      clientLicense,
      pickupLocation, dropoffLocation,
      pickupDate, dropoffDate,
      durationDays: diffDays,
      totalPrice,
      status: form.status,
      message: form.message || undefined,
      createdAt: TODAY,
    };

    saveReservation(reservation);
    refresh();
    setModal(false);
    setForm(EMPTY_FORM);
  };

  const statusStyle = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const statusLabel = { pending: "En attente", confirmed: "Confirmé", cancelled: "Annulé" };

  const inp = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#e63946]";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0d0d1a] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft size={18} />
            Dashboard
          </Link>
          <h1 className="text-lg font-bold ml-2">Réservations</h1>
        </div>
        <button
          onClick={() => { setForm(EMPTY_FORM); setFormError(""); setModal(true); }}
          className="flex items-center gap-2 bg-[#e63946] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#c1121f] transition-colors"
        >
          <Plus size={16} />
          Réservation manuelle
        </button>
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

      {/* Modal réservation manuelle */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-[#1a1a2e] text-lg">Nouvelle réservation manuelle</h2>
                <p className="text-xs text-gray-400 mt-0.5">Client en agence — saisie directe dans le système</p>
              </div>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Client */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Informations client</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Prénom *</label>
                    <input className={inp} value={form.clientFirstName} onChange={(e) => setForm({ ...form, clientFirstName: e.target.value })} placeholder="Prénom" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nom *</label>
                    <input className={inp} value={form.clientLastName} onChange={(e) => setForm({ ...form, clientLastName: e.target.value })} placeholder="Nom" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Téléphone *</label>
                    <input className={inp} value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} placeholder="+212 6 XX XX XX XX" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Email</label>
                    <input className={inp} type="email" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} placeholder="email@exemple.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">N° Permis de conduire *</label>
                    <input className={inp} value={form.clientLicense} onChange={(e) => setForm({ ...form, clientLicense: e.target.value })} placeholder="B-2020-XXXXXX" />
                  </div>
                </div>
              </div>

              {/* Voiture */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Véhicule</h3>
                <select className={inp} value={form.carId} onChange={(e) => setForm({ ...form, carId: e.target.value })}>
                  <option value="">Sélectionner une voiture...</option>
                  {cars.filter((c) => c.status === "available").map((c) => (
                    <option key={c.id} value={c.id}>{c.brand} {c.name} — {c.pricePerDay} DH/j ({c.fuelType})</option>
                  ))}
                </select>
                {form.carId && (() => {
                  const car = cars.find((c) => c.id === form.carId);
                  const days = Math.ceil((new Date(form.dropoffDate).getTime() - new Date(form.pickupDate).getTime()) / 86400000) || 1;
                  return car ? (
                    <p className="text-xs text-[#e63946] font-semibold mt-1.5">
                      {days} jour(s) × {car.pricePerDay} DH = <strong>{days * car.pricePerDay} DH</strong>
                    </p>
                  ) : null;
                })()}
              </div>

              {/* Lieux */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Lieux</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Lieu de départ *</label>
                    <select className={inp} value={form.pickupLocation} onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}>
                      <option value="">Choisir...</option>
                      {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Lieu de retour *</label>
                    <select className={inp} value={form.dropoffLocation} onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })}>
                      <option value="">Choisir...</option>
                      {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Période de location</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Date de départ *</label>
                    <input className={inp} type="date" value={form.pickupDate} onChange={(e) => setForm({ ...form, pickupDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Date de retour *</label>
                    <input className={inp} type="date" min={form.pickupDate} value={form.dropoffDate} onChange={(e) => setForm({ ...form, dropoffDate: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Statut */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Statut initial</h3>
                <div className="flex gap-3">
                  {(["confirmed", "pending"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm({ ...form, status: s })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                        form.status === s
                          ? s === "confirmed" ? "bg-green-500 text-white border-green-500" : "bg-yellow-400 text-white border-yellow-400"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {s === "confirmed" ? "✓ Confirmée" : "⏳ En attente"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Note interne (optionnel)</label>
                <textarea className={inp + " resize-none"} rows={2} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Client venu en agence, caution payée..." />
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{formError}</div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleAdd} className="px-6 py-2.5 rounded-xl bg-[#e63946] text-white text-sm font-bold hover:bg-[#c1121f] transition-colors">
                Enregistrer la réservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
