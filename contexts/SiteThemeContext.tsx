"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const SiteThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function SiteThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme,   setTheme]   = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("site_theme") as Theme | null;
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  const toggle = () =>
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("site_theme", next);
      return next;
    });

  const effective = mounted ? theme : "dark";

  return (
    <SiteThemeContext.Provider value={{ theme: effective, toggle }}>
      <div data-site-theme={effective} style={{ minHeight: "100vh" }}>
        {children}
      </div>
    </SiteThemeContext.Provider>
  );
}

export const useSiteTheme = () => useContext(SiteThemeContext);
