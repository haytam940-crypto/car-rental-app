import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const FLEET_CATEGORIES = [
  { label: "Voitures Économiques", query: "Économique" },
  { label: "Citadines", query: "Citadine" },
  { label: "Compactes", query: "Compacte" },
  { label: "SUV & 4x4", query: "SUV" },
  { label: "Voitures de Luxe", query: "Luxe" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/8">
      {/* Top band */}
      <div className="bg-[#F5C518] py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#0a0a0a] font-bold text-sm">Besoin d'aide ? Appelez-nous 7j/7</p>
          <a href="tel:+212600000000" className="text-[#0a0a0a] text-xl font-black tracking-wide hover:opacity-80 transition-opacity">
            +212 6 00 00 00 00
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-[#F5C518] rounded-lg flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0a0a">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-black text-white">AUTO<span className="text-[#F5C518]">LOC</span></span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Maroc</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Votre partenaire de confiance pour la location de voitures au Maroc. Disponible 7j/7 partout au Maroc.
          </p>
          <div className="flex gap-2">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 border border-white/10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-[#F5C518] hover:text-black hover:border-[#F5C518] transition-all">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Navigation</h4>
          <ul className="space-y-3 text-sm">
            {[
              { href: "/", label: "Accueil" },
              { href: "/fleet", label: "Nos Voitures" },
              { href: "/about", label: "À Propos" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-gray-500 hover:text-[#F5C518] transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#F5C518] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Fleet */}
        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Nos Véhicules</h4>
          <ul className="space-y-3 text-sm">
            {FLEET_CATEGORIES.map(({ label, query }) => (
              <li key={query}>
                <Link href={`/fleet?category=${encodeURIComponent(query)}`}
                  className="text-gray-500 hover:text-[#F5C518] transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#F5C518] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3 text-gray-500">
              <MapPin size={15} className="text-[#F5C518] mt-0.5 shrink-0" />
              <span>123 Boulevard Mohammed V,<br />Casablanca, Maroc</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={15} className="text-[#F5C518] shrink-0" />
              <a href="tel:+212600000000" className="text-gray-500 hover:text-white transition-colors">+212 6 00 00 00 00</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={15} className="text-[#F5C518] shrink-0" />
              <a href="mailto:contact@autoloc.ma" className="text-gray-500 hover:text-white transition-colors">contact@autoloc.ma</a>
            </li>
          </ul>
          <div className="mt-6 flex items-center gap-2 bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-xl px-4 py-3">
            <span className="w-2 h-2 bg-[#F5C518] rounded-full animate-pulse" />
            <span className="text-[#F5C518] text-xs font-semibold">Ouvert 7j/7 — 8h à 22h</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600 gap-3">
        <p>© 2026 AutoLoc Maroc. Tous droits réservés.</p>
        <p>Fait avec passion au Maroc 🇲🇦</p>
      </div>
    </footer>
  );
}
