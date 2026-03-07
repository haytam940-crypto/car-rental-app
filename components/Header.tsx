"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/fleet", label: "Nos Voitures" },
  { href: "/about", label: "A Propos" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className={`text-2xl font-black tracking-tight ${scrolled ? "text-[#1a1a2e]" : "text-white"}`}>
            AUTO<span className="text-[#e63946]">LOC</span>
          </span>
          <span className={`text-xs font-medium uppercase tracking-widest hidden sm:block ${scrolled ? "text-gray-500" : "text-gray-300"}`}>
            Maroc
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium hover:text-[#e63946] transition-colors ${scrolled ? "text-[#1a1a2e]" : "text-white"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a href="tel:+212600000000" className={`flex items-center gap-2 text-sm font-medium ${scrolled ? "text-[#1a1a2e]" : "text-white"}`}>
            <Phone size={16} className="text-[#e63946]" />
            +212 6 00 00 00 00
          </a>
          <Link href="/fleet" className="bg-[#e63946] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#c1121f] transition-colors">
            Réserver
          </Link>
        </div>

        {/* Burger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open
            ? <X size={24} className={scrolled ? "text-[#1a1a2e]" : "text-white"} />
            : <Menu size={24} className={scrolled ? "text-[#1a1a2e]" : "text-white"} />
          }
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white shadow-xl px-4 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#1a1a2e] font-medium text-base border-b pb-3"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/fleet" className="bg-[#e63946] text-white px-5 py-3 rounded-lg font-semibold text-center" onClick={() => setOpen(false)}>
            Réserver une voiture
          </Link>
        </div>
      )}
    </header>
  );
}
