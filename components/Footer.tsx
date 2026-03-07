import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

const FLEET_CATEGORIES = [
  { label: "Voitures Économiques", query: "Économique" },
  { label: "Citadines", query: "Citadine" },
  { label: "Compactes", query: "Compacte" },
  { label: "SUV & 4x4", query: "SUV" },
  { label: "Voitures de Luxe", query: "Luxe" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0d0d1a] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="text-2xl font-black text-white mb-4">
            AUTO<span className="text-[#e63946]">LOC</span>
            <span className="text-sm font-normal text-gray-500 ml-2">Maroc</span>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            Votre partenaire de confiance pour la location de voitures au Maroc.
            Disponible 7j/7 pour tous vos déplacements.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#e63946] transition-colors">
              <Facebook size={16} />
            </a>
            <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#e63946] transition-colors">
              <Instagram size={16} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-3 text-sm">
            {[
              { href: "/", label: "Accueil" },
              { href: "/fleet", label: "Nos Voitures" },
              { href: "/about", label: "A Propos" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[#e63946] transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Fleet categories — chaque lien filtre par categorie */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Nos Véhicules</h4>
          <ul className="space-y-3 text-sm">
            {FLEET_CATEGORIES.map(({ label, query }) => (
              <li key={query}>
                <Link
                  href={`/fleet?category=${encodeURIComponent(query)}`}
                  className="hover:text-[#e63946] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-[#e63946] mt-0.5 shrink-0" />
              <span>123 Boulevard Mohammed V,<br />Casablanca, Maroc</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-[#e63946] shrink-0" />
              <a href="tel:+212600000000" className="hover:text-white">+212 6 00 00 00 00</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-[#e63946] shrink-0" />
              <a href="mailto:contact@autoloc.ma" className="hover:text-white">contact@autoloc.ma</a>
            </li>
          </ul>
          <div className="mt-6 p-3 bg-white/5 rounded-lg text-xs text-center">
            <span className="text-green-400 font-semibold">Ouvert 7j/7</span> — 8h00 a 22h00
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center text-xs gap-3">
        <p>© 2026 AutoLoc Maroc. Tous droits reserves.</p>
        <p>Fait avec passion au Maroc</p>
      </div>
    </footer>
  );
}
