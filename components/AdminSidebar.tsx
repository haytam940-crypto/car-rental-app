"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, ClipboardList, Car as CarIcon, FileText,
  BarChart2, Mountain, Calendar, Tag, FilePlus,
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

  useEffect(() => {
    setRole(readRoleCookie());
  }, []);

  const visibleNav = NAV.filter((item) => {
    if (role === "viewer") return item.viewerAllowed === true;
    if (item.adminOnly) return role === "admin";
    return true;
  });

  return (
    <aside className="w-60 shrink-0 bg-[#0d0d0d] border-r border-white/8 flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-white/8">
        <Link href="/" className="text-xl font-black text-white">
          ESON<span className="text-[#D4A96A]"> MAROC</span>
        </Link>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">Administration</p>
        {role === "agent" && (
          <span className="mt-1.5 inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Agent
          </span>
        )}
        {role === "viewer" && (
          <span className="mt-1.5 inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Lecture seule
          </span>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleNav.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              pathname === href
                ? "bg-[#D4A96A]/10 text-[#D4A96A]"
                : "text-gray-400 hover:text-gray-400 hover:bg-white/5"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/8 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-400 hover:bg-white/5"
        >
          Voir le site
        </Link>
        <button
          onClick={() =>
            fetch("/api/auth/logout", { method: "POST" }).then(() =>
              router.push("/admin/login")
            )
          }
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-white/5"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
