"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, CarCharge, CHARGE_LABELS, ChargeCategory } from "@/lib/data";
import { getStoredCars, getStoredCharges, getMergedReservations } from "@/lib/store";
import { ArrowLeft, TrendingUp, Wallet, Receipt, Car as CarIcon, ClipboardList, FilePlus, FileText, BarChart2, LayoutDashboard, Globe, LogOut, X, Mountain, Calendar, Tag, MapPin } from "lucide-react";

const CHARGE_COLORS: Record<ChargeCategory, string> = {
  gazoil:      "bg-orange-500/15 text-orange-400 border-orange-500/20",
  lavage:      "bg-blue-500/15 text-blue-400 border-blue-500/20",
  vidange:     "bg-[#D4A96A]/15 text-[#D4A96A] border-[#D4A96A]/20",
  vignette:    "bg-purple-500/15 text-purple-400 border-purple-500/20",
  assurance:   "bg-green-500/15 text-green-400 border-green-500/20",
  credit_bail: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  accident:    "bg-red-500/15 text-red-400 border-red-500/20",
  autre:       "bg-gray-500/15 text-gray-400 border-gray-500/20",
};

const navLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/reservations", icon: ClipboardList, label: "Réservations" },
  { href: "/admin/cars", icon: CarIcon, label: "Voitures" },
  { href: "/admin/invoices", icon: FileText, label: "Factures" },
  { href: "/admin/devis", icon: FilePlus, label: "Devis" },
  { href: "/admin/analytics", icon: BarChart2, label: "Analytique" },
  { href: "/admin/excursions", icon: Mountain, label: "Excursions" },
  { href: "/admin/planning",   icon: Calendar, label: "Planning" },
  { href: "/admin/promotions", icon: Tag, label: "Promotions" },
];

export default function AnalyticsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [charges, setCharges] = useState<CarCharge[]>([]);
  const [selectedCar, setSelectedCar] = useState<string>("all");

  useEffect(() => {
    setCars(getStoredCars());
    setCharges(getStoredCharges());
  }, [router]);

  const logout = () => { fetch("/api/auth/logout", { method: "POST" }).then(() => router.push("/admin/login")); };

  const reservations = getMergedReservations().filter((r) => r.status === "confirmed");
  const caBrutByCar = (carId: string) => reservations.filter((r) => r.carId === carId).reduce((s, r) => s + r.totalPrice, 0);
  const chargesByCar = (carId: string) => charges.filter((c) => c.carId === carId).reduce((s, c) => s + c.amount, 0);
  const chargesByCategory = (carId: string) => {
    const map: Partial<Record<ChargeCategory, number>> = {};
    charges.filter((c) => c.carId === carId).forEach((c) => { map[c.category] = (map[c.category] ?? 0) + c.amount; });
    return map;
  };

  const totalCaBrut = cars.reduce((s, car) => s + caBrutByCar(car.id), 0);
  const totalCharges = cars.reduce((s, car) => s + chargesByCar(car.id), 0);
  const totalNet = totalCaBrut - totalCharges;
  const displayCars = selectedCar === "all" ? cars : cars.filter((c) => c.id === selectedCar);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d0d] border-r border-white/8 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-6 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D4A96A] rounded-lg flex items-center justify-center">
              <CarIcon size={16} className="text-black" />
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
                href === "/admin/analytics"
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
            <h1 className="text-lg font-bold text-white">Analytique</h1>
          </div>
          <select
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#D4A96A]/60"
            style={{ colorScheme: "dark" }}
          >
            <option value="all" className="bg-[#1a1a1a]">Toutes les voitures</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id} className="bg-[#1a1a1a]">{car.brand} {car.name}</option>
            ))}
          </select>
        </header>

        <div className="flex-1 p-6">
          {/* KPIs globaux */}
          {selectedCar === "all" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <div className="bg-[#111111] border border-white/8 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp size={20} className="text-blue-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">CA Brut Total</p>
                </div>
                <p className="text-3xl font-black text-white">{totalCaBrut.toLocaleString("fr-FR")} <span className="text-sm font-normal text-gray-500">DH</span></p>
              </div>

              <div className="bg-[#111111] border border-white/8 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-500/15 border border-red-500/20 rounded-xl flex items-center justify-center">
                    <Receipt size={20} className="text-red-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Total Charges</p>
                </div>
                <p className="text-3xl font-black text-white">{totalCharges.toLocaleString("fr-FR")} <span className="text-sm font-normal text-gray-500">DH</span></p>
              </div>

              <div className={`rounded-2xl p-6 border ${totalNet >= 0 ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${totalNet >= 0 ? "bg-green-500/20 border-green-500/30" : "bg-red-500/20 border-red-500/30"}`}>
                    <Wallet size={20} className={totalNet >= 0 ? "text-green-400" : "text-red-400"} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">CA Net Total</p>
                </div>
                <p className={`text-3xl font-black ${totalNet >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {totalNet >= 0 ? "+" : ""}{totalNet.toLocaleString("fr-FR")} <span className="text-sm font-normal text-gray-500">DH</span>
                </p>
              </div>
            </div>
          )}

          {/* Tableau par voiture */}
          <div className="space-y-5">
            {displayCars.map((car) => {
              const brut = caBrutByCar(car.id);
              const totalChg = chargesByCar(car.id);
              const net = brut - totalChg;
              const catMap = chargesByCategory(car.id);
              const carCharges = charges.filter((c) => c.carId === car.id).sort((a, b) => b.date.localeCompare(a.date));

              return (
                <div key={car.id} className="bg-[#111111] border border-white/8 rounded-2xl overflow-hidden">
                  {/* En-tête voiture */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-white/8 bg-white/3">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-10 rounded-xl overflow-hidden bg-white/5 border border-white/8 shrink-0">
                        <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs text-[#D4A96A] font-semibold uppercase tracking-wider">{car.brand}</p>
                        <h3 className="font-bold text-white">{car.name}</h3>
                      </div>
                    </div>
                    <div className="flex gap-6 text-center">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">CA Brut</p>
                        <p className="text-lg font-black text-blue-400">{brut.toLocaleString("fr-FR")} DH</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Charges</p>
                        <p className="text-lg font-black text-red-400">{totalChg.toLocaleString("fr-FR")} DH</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">CA Net</p>
                        <p className={`text-lg font-black ${net >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {net >= 0 ? "+" : ""}{net.toLocaleString("fr-FR")} DH
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Charges par catégorie */}
                    <div>
                      <p className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Charges par catégorie</p>
                      {Object.keys(catMap).length === 0 ? (
                        <p className="text-sm text-gray-600">Aucune charge enregistrée</p>
                      ) : (
                        <div className="space-y-2.5">
                          {(Object.entries(catMap) as [ChargeCategory, number][]).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
                            <div key={cat} className="flex items-center gap-3">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border min-w-[110px] text-center ${CHARGE_COLORS[cat]}`}>
                                {CHARGE_LABELS[cat]}
                              </span>
                              <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="h-full bg-[#D4A96A] rounded-full"
                                  style={{ width: totalChg > 0 ? `${(amt / totalChg) * 100}%` : "0%" }}
                                />
                              </div>
                              <span className="text-sm font-bold text-white min-w-[80px] text-right">
                                {amt.toLocaleString("fr-FR")} DH
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Historique */}
                    <div>
                      <p className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Historique des charges</p>
                      {carCharges.length === 0 ? (
                        <p className="text-sm text-gray-600">Aucune charge</p>
                      ) : (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {carCharges.map((charge) => (
                            <div key={charge.id} className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${CHARGE_COLORS[charge.category]}`}>
                                  {CHARGE_LABELS[charge.category]}
                                </span>
                                {charge.note && <span className="text-gray-600 text-xs">{charge.note}</span>}
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-[#D4A96A]">{charge.amount.toLocaleString("fr-FR")} DH</span>
                                <span className="text-xs text-gray-600 ml-2">{new Date(charge.date).toLocaleDateString("fr-FR")}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Récap global */}
          {selectedCar === "all" && charges.length > 0 && (
            <div className="mt-6 bg-[#111111] border border-white/8 rounded-2xl p-6">
              <p className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-[10px] text-[#D4A96A]">Récapitulatif global des charges</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(Object.keys(CHARGE_LABELS) as ChargeCategory[]).map((cat) => {
                  const total = charges.filter((c) => c.category === cat).reduce((s, c) => s + c.amount, 0);
                  if (total === 0) return null;
                  return (
                    <div key={cat} className={`rounded-xl p-4 border ${CHARGE_COLORS[cat]}`}>
                      <p className="text-xs font-semibold mb-1">{CHARGE_LABELS[cat]}</p>
                      <p className="text-xl font-black">{total.toLocaleString("fr-FR")} DH</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
