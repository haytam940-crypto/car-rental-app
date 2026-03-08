"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function AdminThemeWrapper({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("admin_theme");
    if (saved === "light") setTheme("light");
  }, []);

  const toggle = () =>
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("admin_theme", next);
      return next;
    });

  // attr fixé à "dark" côté serveur pour éviter le mismatch d'hydratation
  const attr = mounted ? theme : "dark";

  return (
    <div data-admin-theme={attr} style={{ minHeight: "100vh" }}>
      {children}

      {/* Bouton flottant toggle theme */}
      {mounted && (
        <button
          onClick={toggle}
          title={theme === "dark" ? "Mode clair" : "Mode sombre"}
          className="fixed bottom-6 right-20 z-[9999] w-11 h-11 rounded-full shadow-xl flex items-center justify-center transition-all"
          style={{
            background: theme === "dark" ? "#D4A96A" : "#1e293b",
            border: `2px solid ${theme === "dark" ? "#b8894e" : "#334155"}`,
          }}
        >
          {theme === "dark"
            ? <Sun  size={18} color="#000" />
            : <Moon size={18} color="#fff" />}
        </button>
      )}
    </div>
  );
}
