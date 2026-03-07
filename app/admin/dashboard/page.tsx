"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CARS, Réservations } from "@/lib/data";
import {
  Car, ClipboardList, TrendingUp, CheckCircle, Clock, XCircle,
  LogOut, LayoutDashboard, Settings, FileText, Menu, X
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("admin_token")) {
      router.push("/admin/login");
    }
  }, [router]);

  const logout = () => {
    sessionStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const available = CARS.filter((c) => c.status === "available").length;
  const rented = CARS.filter((c) => c.status === "rented").length;
  const pending = RESERVATIONS.filter((r) => r.status === "pending").length;
  const confirmed = RESERVATIONS.filter((r) => r.status === "confirmed").length;
  const totalRevenue = RESERVATIONS.filter((r) => r.status === "confirmed")
    .reduce((sum, r) => sum + r.totalPrice, 0);
  const todayRevenue = RESERVATIONS.filter(
    (r) => r.status === "confirmed" && r.createdAt === new Date().toISOString().split("T")[0]
  ).reduce((sum, r) => sum + r.totalPrice, 0);

  const navLinks = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/réservations", icon: ClipboardList, label: "Réservations" },
    { href: "/admin/cars", icon: Car, label: "Voitures" },
    { href: "/admin/invoices", icon: FileText, label: "Factures" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d1a] flex flex-col transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:flex`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="text-xl font-black text-white">
            AUTO<span className="text-[#e63946]">LOC</span>
            <span className="text-xs font-normal text-gray-500 ml-1">Admin</span>
          </div>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
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
                  ? "bg-[#e63946] text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-white/5 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Deconnexion
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#1a1a2e]">Dashboard</h1>
              <p className="text-xs text-gray-400">{new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
            <div className="w-7 h-7 bg-[#e63946] rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
            <span className="text-sm font-medium text-[#1a1a2e] hidden sm:block">Admin</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "CA du mois", value: `${totalRevenue.toLocaleString()} DH`, icon: TrendingUp, color: "bg-[#e63946]", change: "+12%" },
              { label: "Réservations en attente", value: pending, icon: Clock, color: "bg-yellow-500", change: `${Réservations.length} total` },
              { label: "Voitures disponibles", value: available, icon: Car, color: "bg-green-500", change: `${rented} louées` },
              { label: "Confirmees", value: confirmed, icon: CheckCircle, color: "bg-blue-500", change: "ce mois" },
            ].map(({ label, value, icon: Icon, color, change }) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{change}</span>
                </div>
                <div className="text-2xl font-black text-[#1a1a2e] mb-1">{value}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            ))}
          </div>

          {/* Fleet overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Fleet status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-[#1a1a2e] mb-5">Etat du parc</h2>
              <div className="space-y-3">
                {[
                  { label: "Disponibles", count: available, total: CARS.length, color: "bg-green-500" },
                  { label: "Louées", count: rented, total: CARS.length, color: "bg-[#e63946]" },
                  { label: "Maintenance", count: CARS.filter(c => c.status === "maintenance").length, total: CARS.length, color: "bg-yellow-500" },
                ].map(({ label, count, total, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-bold text-[#1a1a2e]">{count}/{total}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-[#1a1a2e]">Réservations recentes</h2>
                <Link href="/admin/réservations" className="text-[#e63946] text-xs font-medium hover:underline">
                  Voir tout
                </Link>
              </div>
              <div className="space-y-3">
                {Réservations.slice(0, 3).map((r) => {
                  const car = CARS.find((c) => c.id === r.carId);
                  const statusStyle = {
                    pending: "bg-yellow-100 text-yellow-700",
                    confirmed: "bg-green-100 text-green-700",
                    cancelled: "bg-red-100 text-red-700",
                  }[r.status];
                  const statusLabel = { pending: "En attente", confirmed: "Confirme", cancelled: "Annule" }[r.status];
                  return (
                    <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-sm text-[#1a1a2e]">
                          {r.clientFirstName} {r.clientLastName}
                        </p>
                        <p className="text-xs text-gray-400">{car?.brand} {car?.name}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusStyle}`}>
                          {statusLabel}
                        </span>
                        <p className="text-xs font-bold text-[#1a1a2e] mt-1">{r.totalPrice} DH</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: "/admin/cars", label: "Ajouter voiture", icon: Car, color: "bg-[#1a1a2e] text-white" },
              { href: "/admin/réservations", label: "Voir réservations", icon: ClipboardList, color: "bg-[#e63946] text-white" },
              { href: "/admin/invoices", label: "Factures", icon: FileText, color: "bg-blue-600 text-white" },
              { href: "/", label: "Voir le site", icon: Settings, color: "bg-gray-100 text-gray-700" },
            ].map(({ href, label, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className={`${color} p-5 rounded-2xl flex flex-col items-center gap-3 hover:opacity-90 transition-opacity text-center`}
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
