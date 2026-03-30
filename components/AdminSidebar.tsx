"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, ClipboardList, Car as CarIcon, FileText,
  BarChart2, Mountain, Calendar, Tag, FilePlus, Menu, X, LogOut, Globe,
} from "lucide-react";
import { ROLE_COOKIE } from "@/lib/auth-edge";

type NavItem = { href: string; icon: React.ElementType; label: string; adminOnly?: boolean; viewerAllowed?: boolean };

const NAV: NavItem[] = [
  { href: "/admin/dashboard",    icon: LayoutDashboard, label: "Dashboard",    viewerAllowed: true },
  { href: "/admin/reservations", icon: ClipboardList,   label: "Réservations" },
  { href: "/admin/cars",         icon: CarIcon,         label: "Voitures" },
  { href: "/admin/invoices",     icon: FileText,        label: "Factures" },
  { href: "/admin/devis",        icon: FilePlus,        label: "Devis" },
  { href: "/admin/analytics",    icon: BarChart2,       label: "Analytique",   viewerAllowed: true },
  { href: "/admin/excursions",   icon: Mountain,        label: "Excursions" },
  { href: "/admin/planning",     icon: Calendar,        label: "Planning" },
  { href: "/admin/promotions",   icon: Tag,             label: "Promotions",   adminOnly: true },
];

function readRoleCookie(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${ROLE_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

export default function AdminSidebar({ pathname }: { pathname: string }) {
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setRole(readRoleCookie());
  }, []);

  // Ferme le menu si on change de route
  useEffect(() => { setOpen(false); }, [pathname]);

  const visibleNav = NAV.filter((item) => {
    if (role === "viewer") return item.viewerAllowed === true;
    if (item.adminOnly) return role === "admin";
    return true;
  });

  const handleLogout = () =>
    fetch("/api/auth/logout", { method: "POST" }).then(() => router.push("/admin/login"));

  // Navigation items communs
  const NavLinks = () => (
    <>
      {visibleNav.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            pathname === href
              ? "bg-[#D4A96A]/10 text-[#D4A96A]"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Icon size={16} />
          {label}
        </Link>
      ))}
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="hidden lg:flex w-60 shrink-0 bg-[#0d0d0d] border-r border-white/8 flex-col min-h-screen">
        <div className="px-6 py-5 border-b border-white/8">
          <Link href="/" className="text-xl font-black text-white">
            ESON<span className="text-[#D4A96A]"> MAROC</span>
          </Link>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">Administration</p>
          {role === "agent" && (
            <span className="mt-1.5 inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Agent</span>
          )}
          {role === "viewer" && (
            <span className="mt-1.5 inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Lecture seule</span>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLinks />
        </nav>
        <div className="px-3 py-4 border-t border-white/8 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5">
            <Globe size={16} />Voir le site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-white/5"
          >
            <LogOut size={16} />Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Mobile topbar ────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0d0d0d] border-b border-white/8 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-base font-black text-white">
          ESON<span className="text-[#D4A96A]"> MAROC</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile spacer (pour que le contenu ne passe pas sous la topbar) */}
      <div className="lg:hidden h-[53px] shrink-0" />

      {/* ── Mobile overlay menu ──────────────────────────────── */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />

          {/* Drawer */}
          <div className="relative w-72 max-w-[85vw] bg-[#0d0d0d] border-r border-white/8 flex flex-col h-full">
            <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
              <div>
                <p className="text-lg font-black text-white">ESON<span className="text-[#D4A96A]"> MAROC</span></p>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">Administration</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <NavLinks />
            </nav>
            <div className="px-3 py-4 border-t border-white/8 space-y-1">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5">
                <Globe size={16} />Voir le site
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-white/5"
              >
                <LogOut size={16} />Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
