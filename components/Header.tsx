"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown, Car, MapPin, Mountain, Users, Info, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteTheme } from "@/contexts/SiteThemeContext";
import { LANGUAGES } from "@/lib/i18n";
import PromoBar from "./PromoBar";

const NAV_ICONS: Record<string, React.ElementType> = {
  "/": Car,
  "/fleet": Car,
  "/partenaires": Users,
  "/excursions": Mountain,
  "/about": Info,
  "/contact": Mail,
};

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const { theme } = useSiteTheme();
  const isLight = theme === "light";
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [promoVisible, setPromoVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const NAV_LINKS = [
    { href: "/", label: t("nav.home") },
    { href: "/fleet", label: t("nav.fleet") },
    { href: "/partenaires", label: t("nav.partners") },
    { href: "/excursions", label: t("nav.excursions") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <PromoBar onVisible={setPromoVisible} />

      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${promoVisible ? "top-11" : "top-0"}`}
        style={scrolled ? {
          background: isLight ? "rgba(255,255,255,0.95)" : "rgba(10,10,10,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: isLight ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.06)",
          boxShadow: isLight ? "0 4px 32px rgba(0,0,0,0.08)" : "0 4px 32px rgba(0,0,0,0.4)",
        } : {
          background: isLight
            ? "linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, transparent 100%)"
            : "linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, transparent 100%)",
        }}
      >
        {/* Main bar — Logo | Nav centré | Actions */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-[68px] flex items-center justify-between">

          {/* ── Logo (extrême gauche) ── */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group flex-1">
            <div className="relative">
              <div className="w-10 h-10 bg-[#D4A96A] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#0a0a0a">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <div className="absolute inset-0 w-10 h-10 bg-[#D4A96A] rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-200" />
            </div>
            <div className="leading-none">
              <div className="text-[18px] font-black text-white tracking-tight">
                ESON<span className="text-[#D4A96A]"> MAROC</span>
              </div>
              <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-[0.18em] mt-0.5">
                Location de Voitures
              </div>
            </div>
          </Link>

          {/* ── Nav (centre absolu) ── */}
          <nav className="hidden lg:flex items-center justify-center">
            <div className="flex items-center gap-0.5 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-2 py-1.5">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      active
                        ? "text-black bg-[#D4A96A] shadow-md"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* ── Actions (extrême droite) ── */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            {/* Language switcher */}
            <div className="hidden md:flex items-center gap-0.5 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1">
              {LANGUAGES.map(({ code, flag }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  title={code.toUpperCase()}
                  className={`w-8 h-7 rounded-lg text-sm flex items-center justify-center transition-all duration-150 ${
                    lang === code ? "bg-[#D4A96A] shadow-sm" : "hover:bg-white/8"
                  }`}
                >
                  {flag}
                </button>
              ))}
            </div>

            {/* Phone */}
            <a
              href="tel:+212666890899"
              className="hidden xl:flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] hover:border-[#D4A96A]/30 rounded-xl px-3 py-2 text-sm text-gray-400 hover:text-white transition-all duration-200"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <Phone size={13} className="text-[#D4A96A]" />
              <span className="font-medium">+212.666.89.08.99</span>
            </a>

            {/* CTA */}
            <Link
              href="/fleet"
              className="hidden md:flex items-center gap-2 bg-[#D4A96A] hover:bg-[#c49558] text-black font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-[#D4A96A]/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              <Car size={14} />
              {t("header.book")}
            </Link>

            {/* ── Burger mobile ── */}
            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 text-white hover:bg-white/10 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <span className={`transition-all duration-200 ${open ? "opacity-0 scale-75" : "opacity-100 scale-100"} absolute`}>
                <Menu size={20} />
              </span>
              <span className={`transition-all duration-200 ${open ? "opacity-100 scale-100" : "opacity-0 scale-75"} absolute`}>
                <X size={20} />
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile overlay ── */}
      <div
        className={`fixed inset-0 z-[45] transition-all duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={() => setOpen(false)}
      />

      {/* ── Mobile drawer ── */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[46] w-[300px] flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: isLight ? "#ffffff" : "#0d0d0d", borderLeft: isLight ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#D4A96A] rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0a0a0a">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <span className="text-base font-black text-white">ESON<span className="text-[#D4A96A]"> MAROC</span></span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            const Icon = NAV_ICONS[link.href] ?? Car;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-[#D4A96A]/12 text-[#D4A96A] border border-[#D4A96A]/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={16} className={active ? "text-[#D4A96A]" : "text-gray-600"} />
                {link.label}
                {active && <span className="ml-auto w-1.5 h-1.5 bg-[#D4A96A] rounded-full" />}
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer */}
        <div className="px-4 pb-6 pt-3 border-t border-white/6 space-y-3">
          {/* Language */}
          <div className="flex items-center gap-1 bg-white/4 border border-white/6 rounded-xl p-1.5">
            {LANGUAGES.map(({ code, flag, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  lang === code ? "bg-[#D4A96A] text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                {flag} {label}
              </button>
            ))}
          </div>

          {/* Phone */}
          <a
            href="tel:+212666890899"
            className="flex items-center gap-3 bg-white/4 border border-white/6 rounded-xl px-4 py-3 text-sm text-gray-300 hover:text-white hover:border-[#D4A96A]/30 transition-all"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <Phone size={14} className="text-[#D4A96A] shrink-0" />
            <span className="font-medium">+212.666.89.08.99</span>
          </a>

          {/* CTA */}
          <Link
            href="/fleet"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 bg-[#D4A96A] hover:bg-[#c49558] text-black font-bold py-3.5 rounded-xl text-sm transition-all w-full shadow-lg"
          >
            <Car size={16} />
            {t("header.bookMobile")}
          </Link>
        </div>
      </div>
    </>
  );
}
