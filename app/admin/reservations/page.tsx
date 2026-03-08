"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CARS, LOCATIONS, Reservation } from "@/lib/data";
import { getMergedReservations, updateReservationStatus, saveReservation, getStoredCars } from "@/lib/store";
import { CheckCircle, XCircle, ArrowLeft, Plus, X, Car, ClipboardList, FileText, BarChart2, LayoutDashboard, Globe, LogOut, Mountain, Calendar, Search, Filter, RotateCcw, Tag, MapPin } from "lucide-react";

const TODAY = new Date().toISOString().split("T")[0];

const EMPTY_FORM = {
  clientFirstName: "", clientLastName: "", clientPhone: "",
  clientEmail: "", clientLicense: "",
  carId: "", pickupLocation: "", dropoffLocation: "",
  pickupDate: TODAY, dropoffDate: TODAY,
  status: "confirmed" as Reservation["status"],
  message: "",
};

const navLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/reservations", icon: ClipboardList, label: "Réservations" },
  { href: "/admin/cars", icon: Car, label: "Voitures" },
  { href: "/admin/invoices", icon: FileText, label: "Factures" },
  { href: "/admin/analytics", icon: BarChart2, label: "Analytique" },
  { href: "/admin/excursions", icon: Mountain, label: "Excursions" },
  { href: "/admin/planning",   icon: Calendar, label: "Planning" },
  { href: "/admin/promotions", icon: Tag, label: "Promotions" },
];

export default function AdminReservationsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [search, setSearch] = useState("");
  const [carFilter, setCarFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
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

  const logout = () => { sessionStorage.removeItem("admin_token"); router.push("/admin/login"); };
  const refresh = () => setReservations(getMergedReservations());
  const resetFilters = () => { setSearch(""); setCarFilter(""); setDateFrom(""); setDateTo(""); setFilter("all"); };
  const hasFilters = !!(search || carFilter || dateFrom || dateTo || filter !== "all");

  const filtered = reservations.filter(r => {
    if (filter !== "all" && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!`${r.clientFirstName} ${r.clientLastName} ${r.clientPhone} ${r.clientEmail} ${r.clientLicense}`.toLowerCase().includes(q)) return false;
    }
    if (carFilter && r.carId !== carFilter) return false;
    if (dateFrom && r.dropoffDate < dateFrom) return false;
    if (dateTo && r.pickupDate > dateTo) return false;
    return true;
  });

  const changeStatus = (id: string, status: "confirmed" | "cancelled") => {
    updateReservationStatus(id, status);
    refresh();
  };

  const handleAdd = () => {
    setFormError("");
    const { clientFirstName, clientLastName, clientPhone, clientLicense, carId, pickupLocation, dropoffLocation, pickupDate, dropoffDate } = form;
    if (!clientFirstName || !clientLastName || !clientPhone || !clientLicense)
      return setFormError("Veuillez remplir tous les champs client.");
    if (form.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.clientEmail))
      return setFormError("Adresse email invalide (ex: nom@domaine.com)");
    if (!carId) return setFormError("Veuillez sélectionner une voiture.");
    if (!pickupLocation || !dropoffLocation) return setFormError("Veuillez sélectionner les lieux.");
    if (dropoffDate < pickupDate) return setFormError("La date de retour doit être après la date de départ.");

    const car = cars.find((c) => c.id === carId);
    const diffDays = Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / 86400000) || 1;
    const totalPrice = diffDays * (car?.pricePerDay ?? 0);

    saveReservation({
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
    });
    refresh();
    setModal(false);
    setForm(EMPTY_FORM);
  };

  const statusStyle: Record<string, string> = {
    pending: "bg-[#D4A96A]/15 text-[#D4A96A] border border-[#D4A96A]/20",
    confirmed: "bg-green-500/15 text-green-400 border border-green-500/20",
    cancelled: "bg-red-500/15 text-red-400 border border-red-500/20",
  };
  const statusLabel: Record<string, string> = { pending: "En attente", confirmed: "Confirmé", cancelled: "Annulé" };

  const inp = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4A96A]/60 transition-colors placeholder-gray-600";
  const filterInp = "bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#D4A96A]/60 transition-colors placeholder-gray-600";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d0d] border-r border-white/8 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-6 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D4A96A] rounded-lg flex items-center justify-center">
              <Car size={16} className="text-black" />
            </div>
            <div className="text-xl font-black text-white">
              ESON<span className="text-[#D4A96A]"> MAROC</span>
              <span className="text-xs font-normal text-gray-600 ml-1 block -mt-1">Admin</span>
            </div>
          </div>
          <button className="lg:hidden text-gray-500 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                href === "/admin/reservations"
                  ? "bg-[#D4A96A] text-black font-bold"
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}>
              <Icon size={17} />{label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/8 space-y-1">
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-white/5 hover:text-white transition-colors">
            <Globe size={17} />Voir le site
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut size={17} />Déconnexion
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-[#0d0d0d] border-b border-white/8 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-500 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <LayoutDashboard size={22} />
            </button>
            <h1 className="text-lg font-bold text-white">Réservations</h1>
          </div>
          <button
            onClick={() => { setForm(EMPTY_FORM); setFormError(""); setModal(true); }}
            className="flex items-center gap-2 bg-[#D4A96A] text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#b8894e] transition-colors"
          >
            <Plus size={16} />
            Réservation manuelle
          </button>
        </header>

        <div className="flex-1 p-6 space-y-5">
          {/* ── Filter bar ── */}
          <div className="bg-[#111] border border-white/8 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <Filter size={12} />Filtres de recherche
              {hasFilters && (
                <button onClick={resetFilters} className="ml-auto flex items-center gap-1 text-[#D4A96A] hover:text-[#b8894e] transition-colors font-semibold">
                  <RotateCcw size={11} />Réinitialiser
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  className={filterInp + " pl-8 w-full"}
                  placeholder="Nom, téléphone, email, permis..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select className={filterInp + " w-full"} value={carFilter} onChange={e => setCarFilter(e.target.value)} style={{ colorScheme: "dark" }}>
                <option value="" className="bg-[#1a1a1a]">Toutes les voitures</option>
                {cars.map(c => <option key={c.id} value={c.id} className="bg-[#1a1a1a]">{c.brand} {c.name}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <input className={filterInp + " flex-1"} type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ colorScheme: "dark" }} title="Période — du" />
                <span className="text-gray-600 text-xs shrink-0">→</span>
                <input className={filterInp + " flex-1"} type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ colorScheme: "dark" }} title="Période — au" />
              </div>
            </div>
            {hasFilters && (
              <p className="text-xs text-gray-500">
                <span className="text-[#D4A96A] font-semibold">{filtered.length}</span> résultat(s) sur {reservations.length}
              </p>
            )}
          </div>

          {/* Status counts */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === s
                    ? "bg-[#D4A96A] text-black font-bold"
                    : "bg-[#111111] text-gray-400 border border-white/8 hover:border-[#D4A96A]/30 hover:text-white"
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
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-16 text-center">
              <p className="text-gray-500">Aucune réservation trouvée</p>
              {hasFilters && <button onClick={resetFilters} className="mt-3 text-[#D4A96A] text-sm hover:underline">Effacer les filtres</button>}
            </div>
          ) : (
            <div className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/8">
                    <tr>
                      {["Client", "Voiture", "Lieu départ → retour", "Dates", "Durée", "Total", "Statut", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((r) => {
                      const car = CARS.find((c) => c.id === r.carId);
                      return (
                        <tr key={r.id} className="hover:bg-white/3 transition-colors">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-sm text-white">{r.clientFirstName} {r.clientLastName}</p>
                            <p className="text-xs text-gray-500">{r.clientPhone}</p>
                            <p className="text-xs text-gray-600">{r.clientEmail}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-medium text-white">{car ? `${car.brand} ${car.name}` : r.carId}</p>
                            <p className="text-xs text-gray-500">{car?.pricePerDay} DH/j</p>
                          </td>
                          <td className="px-4 py-4 text-xs text-gray-500 max-w-[180px]">
                            <p className="truncate">{r.pickupLocation}</p>
                            <p className="truncate text-gray-600">→ {r.dropoffLocation}</p>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-400 whitespace-nowrap">
                            <p>{r.pickupDate}{r.pickupTime && <span className="text-gray-600 ml-1">{r.pickupTime}</span>}</p>
                            <p className="text-gray-600">→ {r.dropoffDate}{r.dropoffTime && <span className="ml-1">{r.dropoffTime}</span>}</p>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-400 whitespace-nowrap">{r.durationDays}j</td>
                          <td className="px-4 py-4">
                            <span className="font-bold text-[#D4A96A] whitespace-nowrap">{r.totalPrice} DH HT</span>
                            {((r.deliveryFee ?? 0) > 0 || (r.recoveryFee ?? 0) > 0) && (
                              <p className="text-[10px] text-gray-600 mt-0.5">
                                {(r.deliveryFee ?? 0) > 0 && <span>Livr. {r.deliveryFee} DH </span>}
                                {(r.recoveryFee ?? 0) > 0 && <span>Récup. {r.recoveryFee} DH</span>}
                              </p>
                            )}
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
                                  <button onClick={() => changeStatus(r.id, "confirmed")}
                                    className="p-1.5 bg-green-500/15 text-green-400 rounded-lg hover:bg-green-500/25 transition-colors" title="Confirmer">
                                    <CheckCircle size={16} />
                                  </button>
                                  <button onClick={() => changeStatus(r.id, "cancelled")}
                                    className="p-1.5 bg-red-500/15 text-red-400 rounded-lg hover:bg-red-500/25 transition-colors" title="Annuler">
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

      {/* Modal réservation manuelle */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <div>
                <h2 className="font-bold text-white text-lg">Nouvelle réservation manuelle</h2>
                <p className="text-xs text-gray-500 mt-0.5">Client en agence — saisie directe dans le système</p>
              </div>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Client */}
              <div>
                <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Informations client</h3>
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
                    <label className="block text-xs text-gray-500 mb-1">N° Permis *</label>
                    <input className={inp} value={form.clientLicense} onChange={(e) => setForm({ ...form, clientLicense: e.target.value })} placeholder="B-2020-XXXXXX" />
                  </div>
                </div>
              </div>

              {/* Voiture */}
              <div>
                <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Véhicule</h3>
                <select className={inp} value={form.carId} onChange={(e) => setForm({ ...form, carId: e.target.value })} style={{ colorScheme: "dark" }}>
                  <option value="" className="bg-[#1a1a1a]">Sélectionner une voiture...</option>
                  {cars.filter((c) => c.status === "available").map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#1a1a1a]">{c.brand} {c.name} — {c.pricePerDay} DH/j</option>
                  ))}
                </select>
                {form.carId && (() => {
                  const car = cars.find((c) => c.id === form.carId);
                  const days = Math.ceil((new Date(form.dropoffDate).getTime() - new Date(form.pickupDate).getTime()) / 86400000) || 1;
                  return car ? (
                    <p className="text-xs text-[#D4A96A] font-semibold mt-1.5">
                      {days} jour(s) × {car.pricePerDay} DH = <strong>{days * car.pricePerDay} DH</strong>
                    </p>
                  ) : null;
                })()}
              </div>

              {/* Lieux */}
              <div>
                <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Lieux</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Lieu de départ *</label>
                    <select className={inp} value={form.pickupLocation} onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })} style={{ colorScheme: "dark" }}>
                      <option value="" className="bg-[#1a1a1a]">Choisir...</option>
                      {LOCATIONS.map((l) => <option key={l} value={l} className="bg-[#1a1a1a]">{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Lieu de retour *</label>
                    <select className={inp} value={form.dropoffLocation} onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })} style={{ colorScheme: "dark" }}>
                      <option value="" className="bg-[#1a1a1a]">Choisir...</option>
                      {LOCATIONS.map((l) => <option key={l} value={l} className="bg-[#1a1a1a]">{l}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Période de location</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Date de départ *</label>
                    <input className={inp} type="date" value={form.pickupDate} onChange={(e) => setForm({ ...form, pickupDate: e.target.value })} style={{ colorScheme: "dark" }} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Date de retour *</label>
                    <input className={inp} type="date" min={form.pickupDate} value={form.dropoffDate} onChange={(e) => setForm({ ...form, dropoffDate: e.target.value })} style={{ colorScheme: "dark" }} />
                  </div>
                </div>
              </div>

              {/* Statut */}
              <div>
                <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Statut initial</h3>
                <div className="flex gap-3">
                  {(["confirmed", "pending"] as const).map((s) => (
                    <button key={s} onClick={() => setForm({ ...form, status: s })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                        form.status === s
                          ? s === "confirmed"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-[#D4A96A]/15 text-[#D4A96A] border-[#D4A96A]/30"
                          : "bg-white/5 text-gray-500 border-white/10 hover:border-white/20"
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
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{formError}</div>
              )}
            </div>

            <div className="p-6 border-t border-white/8 flex gap-3 justify-end">
              <button onClick={() => setModal(false)} className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-gray-400 hover:bg-white/5">
                Annuler
              </button>
              <button onClick={handleAdd} className="px-6 py-2.5 rounded-xl bg-[#D4A96A] text-black text-sm font-bold hover:bg-[#b8894e] transition-colors">
                Enregistrer la réservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
