"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/fleet", label: "Nos Voitures" },
  { href: "/about", label: "À Propos" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#0a0a0a] border-b border-white/8 py-3 shadow-xl" : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#F5C518] rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0a0a">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight">AUTO<span className="text-[#F5C518]">LOC</span></span>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest block -mt-0.5">Maroc</span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#F5C518] transition-colors relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#F5C518] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a href="tel:+212600000000" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <Phone size={15} className="text-[#F5C518]" />
            +212 6 00 00 00 00
          </a>
          <Link href="/fleet" className="yellow-btn px-5 py-2.5 rounded-lg text-sm">
            Réserver maintenant
          </Link>
        </div>

        {/* Burger */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#111] border-t border-white/8 px-4 py-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-300 font-medium text-base py-3 border-b border-white/8 hover:text-[#F5C518] transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/fleet"
            className="yellow-btn mt-4 py-3.5 rounded-xl text-center text-sm"
            onClick={() => setOpen(false)}
          >
            Réserver une voiture
          </Link>
        </div>
      )}
    </header>
  );
}
