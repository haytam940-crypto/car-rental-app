"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CARS } from "@/lib/data";
import { getMergedReservations } from "@/lib/store";
import { Reservation } from "@/lib/data";
import {
  Car, ClipboardList, TrendingUp, CheckCircle, Clock,
  LogOut, LayoutDashboard, FileText, FilePlus, Menu, X, BarChart2, Globe, Mountain, Calendar, Tag, MapPin
} from "lucide-react";

const navLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/reservations", icon: ClipboardList, label: "Réservations" },
  { href: "/admin/cars", icon: Car, label: "Voitures" },
  { href: "/admin/invoices", icon: FileText, label: "Factures" },
  { href: "/admin/devis", icon: FilePlus, label: "Devis" },
  { href: "/admin/analytics", icon: BarChart2, label: "Analytique" },
  { href: "/admin/excursions", icon: Mountain, label: "Excursions" },
  { href: "/admin/planning",   icon: Calendar, label: "Planning" },
  { href: "/admin/promotions", icon: Tag, label: "Promotions" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    setAllReservations(getMergedReservations());
  }, [router]);

  const logout = () => {
    fetch("/api/auth/logout", { method: "POST" }).then(() => router.push("/admin/login"));
  };

  const available = CARS.filter((c) => c.status === "available").length;
  const rented = CARS.filter((c) => c.status === "rented").length;
  const pending = allReservations.filter((r) => r.status === "pending").length;
  const confirmed = allReservations.filter((r) => r.status === "confirmed").length;
  const totalRevenue = allReservations
    .filter((r) => r.status === "confirmed")
    .reduce((sum, r) => sum + r.totalPrice, 0);

  const statusLabel: Record<string, string> = { pending: "En attente", confirmed: "Confirmé", cancelled: "Annulé" };
  const statusStyle: Record<string, string> = {
    pending: "bg-[#D4A96A]/15 text-[#D4A96A] border border-[#D4A96A]/20",
    confirmed: "bg-green-500/15 text-green-400 border border-green-500/20",
    cancelled: "bg-red-500/15 text-red-400 border border-red-500/20",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d0d] border-r border-white/8 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:flex`}>
        {/* Logo */}
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

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                href === "/admin/dashboard"
                  ? "bg-[#D4A96A] text-black font-bold"
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        {/* View site + Logout */}
        <div className="p-4 border-t border-white/8 space-y-1">
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-white/5 hover:text-white transition-colors">
            <Globe size={17} />
            Voir le site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={17} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-[#0d0d0d] border-b border-white/8 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-500 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Dashboard</h1>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <div className="w-7 h-7 bg-[#D4A96A] rounded-full flex items-center justify-center text-black text-xs font-black">A</div>
            <span className="text-sm font-medium text-white hidden sm:block">Admin</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "CA confirmé", value: `${totalRevenue.toLocaleString()} DH`, icon: TrendingUp, accent: "text-[#D4A96A]", bg: "bg-[#D4A96A]/10 border-[#D4A96A]/20", change: `${allReservations.length} réservations` },
              { label: "En attente", value: pending, icon: Clock, accent: "text-[#D4A96A]", bg: "bg-[#D4A96A]/10 border-[#D4A96A]/20", change: `${allReservations.length} total` },
              { label: "Disponibles", value: available, icon: Car, accent: "text-green-400", bg: "bg-green-500/10 border-green-500/20", change: `${rented} louées` },
              { label: "Confirmées", value: confirmed, icon: CheckCircle, accent: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", change: "ce mois" },
            ].map(({ label, value, icon: Icon, accent, bg, change }) => (
              <div key={label} className="bg-[#111111] border border-white/8 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${bg} border rounded-xl flex items-center justify-center`}>
                    <Icon size={20} className={accent} />
                  </div>
                  <span className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded-full">{change}</span>
                </div>
                <div className={`text-2xl font-black mb-1 ${accent}`}>{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          {/* Fleet + Réservations récentes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Fleet status */}
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-6">
              <h2 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">État du parc</h2>
              <div className="space-y-4">
                {[
                  { label: "Disponibles", count: available, total: CARS.length, color: "bg-green-500" },
                  { label: "Louées", count: rented, total: CARS.length, color: "bg-[#D4A96A]" },
                  { label: "Maintenance", count: CARS.filter(c => c.status === "maintenance").length, total: CARS.length, color: "bg-red-500" },
                ].map(({ label, count, total, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-400">{label}</span>
                      <span className="font-bold text-white">{count}/{total}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all`}
                        style={{ width: `${(count / total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent réservations */}
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-white text-sm uppercase tracking-wider">Réservations récentes</h2>
                <Link href="/admin/reservations" className="text-[#D4A96A] text-xs font-medium hover:underline">
                  Voir tout →
                </Link>
              </div>
              <div className="space-y-3">
                {allReservations.slice(0, 3).map((r) => {
                  const car = CARS.find((c) => c.id === r.carId);
                  return (
                    <div key={r.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/8">
                      <div>
                        <p className="font-semibold text-sm text-white">{r.clientFirstName} {r.clientLastName}</p>
                        <p className="text-xs text-gray-500">{car?.brand} {car?.name}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusStyle[r.status]}`}>
                          {statusLabel[r.status]}
                        </span>
                        <p className="text-xs font-bold text-[#D4A96A] mt-1">{r.totalPrice} DH</p>
                      </div>
                    </div>
                  );
                })}
                {allReservations.length === 0 && (
                  <p className="text-gray-600 text-sm text-center py-4">Aucune réservation</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: "/admin/cars", label: "Ajouter voiture", icon: Car },
              { href: "/admin/reservations", label: "Réservations", icon: ClipboardList },
              { href: "/admin/invoices", label: "Factures", icon: FileText },
              { href: "/admin/analytics", label: "Analytique", icon: BarChart2 },
            ].map(({ href, label, icon: Icon }, i) => (
              <Link
                key={href}
                href={href}
                className={`p-5 rounded-2xl border flex flex-col items-center gap-3 hover:border-[#D4A96A]/40 transition-all text-center group ${
                  i === 0
                    ? "bg-[#D4A96A] border-[#D4A96A] text-black hover:bg-[#b8894e]"
                    : "bg-[#111111] border-white/8 text-gray-400 hover:text-white"
                }`}
              >
                <Icon size={22} />
                <span className="text-sm font-semibold">{label}</span>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
