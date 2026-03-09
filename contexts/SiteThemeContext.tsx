"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const SiteThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function SiteThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("site_theme") as Theme | null;
    const initial = saved === "light" ? "light" : "dark";
    setTheme(initial);
    // Applique directement sur <html> pour couvrir tout le document
    document.documentElement.setAttribute("data-site-theme", initial);
  }, []);

  const toggle = () =>
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("site_theme", next);
      document.documentElement.setAttribute("data-site-theme", next);
      return next;
    });

  return (
    <SiteThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </SiteThemeContext.Provider>
  );
}

export const useSiteTheme = () => useContext(SiteThemeContext);
