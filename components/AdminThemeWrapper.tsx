"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function AdminThemeWrapper({ children }: { children: React.ReactNode }) {
  const [adminTheme, setAdminTheme] = useState<"dark" | "light">("dark");
  const [siteTheme,  setSiteTheme]  = useState<"dark" | "light">("dark");
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => {
    setMounted(true);
    const a = localStorage.getItem("admin_theme") === "light" ? "light" : "dark";
    const s = localStorage.getItem("site_theme")  === "light" ? "light" : "dark";
    setAdminTheme(a);
    setSiteTheme(s);
    // Applique sur <html> pour couvrir tout le document admin
    document.documentElement.setAttribute("data-admin-theme", a);
  }, []);

  const toggleAdmin = () =>
    setAdminTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("admin_theme", next);
      document.documentElement.setAttribute("data-admin-theme", next);
      return next;
    });

  const toggleSite = () =>
    setSiteTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("site_theme", next);
      return next;
    });

  return (
    <>
      {children}

      {mounted && (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end">
          {/* Thème du panneau admin */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: adminTheme === "dark" ? "#1e293b" : "#e2e8f0", color: adminTheme === "dark" ? "#94a3b8" : "#475569" }}>
              Admin
            </span>
            <button
              onClick={toggleAdmin}
              title={adminTheme === "dark" ? "Admin : mode clair" : "Admin : mode sombre"}
              className="w-10 h-10 rounded-full shadow-xl flex items-center justify-center transition-all"
              style={{ background: adminTheme === "dark" ? "#D4A96A" : "#1e293b", border: `2px solid ${adminTheme === "dark" ? "#b8894e" : "#334155"}` }}
            >
              {adminTheme === "dark" ? <Sun size={16} color="#000" /> : <Moon size={16} color="#fff" />}
            </button>
          </div>

          {/* Thème du site public */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: adminTheme === "dark" ? "#1e293b" : "#e2e8f0", color: adminTheme === "dark" ? "#94a3b8" : "#475569" }}>
              Site
            </span>
            <button
              onClick={toggleSite}
              title={siteTheme === "dark" ? "Site : mode clair" : "Site : mode sombre"}
              className="w-10 h-10 rounded-full shadow-xl flex items-center justify-center transition-all"
              style={{ background: siteTheme === "dark" ? "#6366f1" : "#e0e7ff", border: `2px solid ${siteTheme === "dark" ? "#4f46e5" : "#a5b4fc"}` }}
            >
              {siteTheme === "dark" ? <Sun size={16} color="#fff" /> : <Moon size={16} color="#4f46e5" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
