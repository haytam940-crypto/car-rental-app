"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMergedReservations, getStoredCars } from "@/lib/store";
import { Car, Reservation } from "@/lib/data";
import {
  LayoutDashboard, ClipboardList, Car as CarIcon, FileText, BarChart2,
  Mountain, Calendar, Globe, LogOut, X, ChevronLeft, ChevronRight, Tag, MapPin,
} from "lucide-react";

const MONTHS_FR = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
];
const DAYS_FR = ["Di","Lu","Ma","Me","Je","Ve","Sa"];

const navLinks = [
  { href: "/admin/dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/reservations", icon: ClipboardList,   label: "Réservations" },
  { href: "/admin/cars",         icon: CarIcon,         label: "Voitures" },
  { href: "/admin/invoices",     icon: FileText,        label: "Factures" },
  { href: "/admin/analytics",    icon: BarChart2,       label: "Analytique" },
  { href: "/admin/excursions",   icon: Mountain,        label: "Excursions" },
  { href: "/admin/planning",     icon: Calendar,        label: "Planning" },
  { href: "/admin/promotions",   icon: Tag, label: "Promotions" },
];

export default function AdminPlanningPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  useEffect(() => {
    if (!sessionStorage.getItem("admin_token")) { router.push("/admin/login"); return; }
    setCars(getStoredCars());
    setReservations(getMergedReservations());
  }, [router]);

  const logout = () => { sessionStorage.removeItem("admin_token"); router.push("/admin/login"); };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const todayStr = now.toISOString().split("T")[0];

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  const goToday = () => { setYear(now.getFullYear()); setMonth(now.getMonth()); };

  const fmtDate = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const getBooking = (carId: string, day: number) => {
    const d = fmtDate(day);
    return reservations.find(r =>
      r.carId === carId && r.pickupDate <= d && r.dropoffDate >= d && r.status !== "cancelled"
    );
  };

  const monthStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const monthEnd = fmtDate(daysInMonth);
  const monthRes = reservations.filter(r =>
    r.status !== "cancelled" && r.pickupDate <= monthEnd && r.dropoffDate >= monthStart
  );
  const monthRevenue = reservations.filter(r =>
    r.status === "confirmed" && r.pickupDate >= monthStart && r.pickupDate <= monthEnd
  ).reduce((s, r) => s + r.totalPrice, 0);

  const occupancyRate = cars.length > 0
    ? Math.round((monthRes.length / (cars.length * daysInMonth)) * 100 * daysInMonth / daysInMonth)
    : 0;

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
                href === "/admin/planning"
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-[#0d0d0d] border-b border-white/8 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-500 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <LayoutDashboard size={22} />
            </button>
            <h1 className="text-lg font-bold text-white">Planning des Véhicules</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={goToday} className="px-3 py-1.5 text-xs font-semibold border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-colors">
              Aujourd'hui
            </button>
            <div className="flex items-center gap-1 bg-[#111] border border-white/10 rounded-xl p-1">
              <button onClick={prevMonth} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-white px-3 min-w-[140px] text-center capitalize">
                {MONTHS_FR[month]} {year}
              </span>
              <button onClick={nextMonth} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="shrink-0 px-6 pt-4 pb-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Réservations du mois", value: monthRes.length, color: "text-white" },
            { label: "Confirmées", value: monthRes.filter(r => r.status === "confirmed").length, color: "text-green-400" },
            { label: "En attente", value: monthRes.filter(r => r.status === "pending").length, color: "text-[#D4A96A]" },
            { label: "CA du mois", value: `${monthRevenue.toLocaleString()} DH`, color: "text-[#D4A96A]" },
          ].map(s => (
            <div key={s.label} className="bg-[#111] border border-white/8 rounded-xl p-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="shrink-0 px-6 py-2 flex items-center gap-5 flex-wrap">
          {[
            { color: "bg-green-500/75", label: "Confirmée" },
            { color: "bg-[#D4A96A]/75", label: "En attente" },
            { color: "bg-white/10 ring-1 ring-[#D4A96A]/50 ring-inset", label: "Aujourd'hui" },
            { color: "bg-white/[0.03]", label: "Week-end" },
          ].map(l => (
            <span key={l.label} className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className={`w-3 h-3 rounded-sm ${l.color}`} />{l.label}
            </span>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          {cars.length === 0 ? (
            <div className="bg-[#111] border border-white/8 rounded-2xl p-16 text-center">
              <p className="text-gray-500">Aucun véhicule trouvé</p>
            </div>
          ) : (
            <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/8">
                    <th className="sticky left-0 z-10 bg-[#161616] border-r border-white/8 px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest min-w-[170px] w-[170px]">
                      Véhicule
                    </th>
                    {days.map(day => {
                      const d = fmtDate(day);
                      const isToday = d === todayStr;
                      const dow = new Date(year, month, day).getDay();
                      const isWeekend = dow === 0 || dow === 6;
                      return (
                        <th key={day} className={`min-w-[32px] w-8 px-0 py-1.5 text-center border-r border-white/5 ${isToday ? "bg-[#D4A96A]/15" : isWeekend ? "bg-white/[0.02]" : ""}`}>
                          <div className={`text-[9px] font-medium ${isToday ? "text-[#D4A96A]" : "text-gray-600"}`}>
                            {DAYS_FR[dow]}
                          </div>
                          <div className={`text-[11px] font-bold ${isToday ? "text-[#D4A96A]" : isWeekend ? "text-gray-400" : "text-gray-500"}`}>
                            {day}
                          </div>
                        </th>
                      );
                    })}
                    <th className="px-3 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap text-right min-w-[60px]">
                      Dispo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {cars.map(car => {
                    const bookedDays = days.filter(d => !!getBooking(car.id, d)).length;
                    const freeDays = daysInMonth - bookedDays;
                    return (
                      <tr key={car.id} className="hover:bg-white/[0.015] transition-colors group">
                        <td className="sticky left-0 z-10 bg-[#111] group-hover:bg-[#161616] border-r border-white/8 px-4 py-2 transition-colors min-w-[170px] w-[170px]">
                          <p className="text-sm font-semibold text-white whitespace-nowrap truncate">{car.brand} {car.name}</p>
                          <p className="text-[10px] text-gray-600">{car.year} · {car.category}</p>
                        </td>
                        {days.map(day => {
                          const booking = getBooking(car.id, day);
                          const d = fmtDate(day);
                          const isToday = d === todayStr;
                          const isWeekend = [0, 6].includes(new Date(year, month, day).getDay());
                          const prevB = day > 1 ? getBooking(car.id, day - 1) : null;
                          const nextB = day < daysInMonth ? getBooking(car.id, day + 1) : null;
                          const contLeft = !!(booking && prevB && prevB.id === booking.id);
                          const contRight = !!(booking && nextB && nextB.id === booking.id);

                          return (
                            <td
                              key={day}
                              className={`min-w-[32px] w-8 h-10 border-r border-white/5 p-[3px] ${isToday ? "bg-[#D4A96A]/10" : isWeekend ? "bg-white/[0.01]" : ""} ${booking ? "cursor-pointer" : ""}`}
                              onClick={() => booking && setSelectedRes(booking)}
                            >
                              {booking && (
                                <div
                                  className={`h-full transition-opacity hover:opacity-90 ${
                                    booking.status === "confirmed" ? "bg-green-500/75" : "bg-[#D4A96A]/75"
                                  } ${contLeft ? "rounded-l-none -ml-[3px] pl-[3px]" : "rounded-l"} ${contRight ? "rounded-r-none -mr-[3px] pr-[3px]" : "rounded-r"}`}
                                  title={`${booking.clientFirstName} ${booking.clientLastName} · ${booking.pickupDate} → ${booking.dropoffDate}`}
                                />
                              )}
                            </td>
                          );
                        })}
                        <td className="px-3 py-2 text-right whitespace-nowrap">
                          <span className={`text-xs font-bold ${freeDays > 15 ? "text-green-400" : freeDays > 5 ? "text-[#D4A96A]" : "text-red-400"}`}>
                            {freeDays}j
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selectedRes && (() => {
        const car = cars.find(c => c.id === selectedRes.carId);
        return (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
            <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-sm">
              <div className="flex items-center justify-between p-5 border-b border-white/8">
                <div>
                  <p className="text-[10px] text-[#D4A96A] font-bold uppercase tracking-widest mb-0.5">Réservation</p>
                  <h2 className="font-bold text-white text-base">{car ? `${car.brand} ${car.name}` : selectedRes.carId}</h2>
                </div>
                <button onClick={() => setSelectedRes(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-3 text-sm">
                {[
                  { label: "Client", value: `${selectedRes.clientFirstName} ${selectedRes.clientLastName}` },
                  { label: "Téléphone", value: selectedRes.clientPhone },
                  { label: "Départ", value: `${selectedRes.pickupDate} · ${selectedRes.pickupLocation}` },
                  { label: "Retour", value: `${selectedRes.dropoffDate} · ${selectedRes.dropoffLocation}` },
                  { label: "Durée", value: `${selectedRes.durationDays} jour(s)` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-3">
                    <span className="text-gray-500 shrink-0">{label}</span>
                    <span className="text-gray-200 text-right">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t border-white/8">
                  <span className="text-gray-500">Montant</span>
                  <span className="text-xl font-black text-[#D4A96A]">{selectedRes.totalPrice} DH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Statut</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    selectedRes.status === "confirmed"
                      ? "bg-green-500/15 text-green-400 border border-green-500/20"
                      : "bg-[#D4A96A]/15 text-[#D4A96A] border border-[#D4A96A]/20"
                  }`}>
                    {selectedRes.status === "confirmed" ? "Confirmée" : "En attente"}
                  </span>
                </div>
              </div>
              <div className="p-5 border-t border-white/8 flex gap-3">
                <button onClick={() => setSelectedRes(null)} className="flex-1 py-2 rounded-xl border border-white/10 text-sm text-gray-400 hover:bg-white/5 transition-colors">
                  Fermer
                </button>
                <Link href="/admin/reservations" className="flex-1 py-2 rounded-xl bg-[#D4A96A] text-black text-sm font-bold text-center hover:bg-[#b8894e] transition-colors">
                  Voir réservations
                </Link>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
