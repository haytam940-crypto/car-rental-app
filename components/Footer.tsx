"use client";
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const FLEET_CATEGORIES = [
    { label: t("footer.cat.economic"), query: "Économique" },
    { label: t("footer.cat.city"), query: "Citadine" },
    { label: t("footer.cat.compact"), query: "Compacte" },
    { label: t("footer.cat.suv"), query: "SUV" },
    { label: t("footer.cat.luxury"), query: "Luxe" },
  ];

  const EXCURSION_CATEGORIES = [
    { label: t("footer.exc.desert"), cat: "Désert" },
    { label: t("footer.exc.mountain"), cat: "Montagne" },
    { label: t("footer.exc.coast"), cat: "Côte" },
    { label: t("footer.exc.city"), cat: "Ville" },
    { label: t("footer.exc.circuit"), cat: "Circuit" },
  ];

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/8">
      {/* Top band */}
      <div className="bg-[#D4A96A] py-4">
        <div className="w-full px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#0a0a0a] font-bold text-sm">{t("footer.helpBanner")}</p>
          <a href="tel:+212524890562" className="text-[#0a0a0a] text-xl font-black tracking-wide hover:opacity-80 transition-opacity">
            +212.524.89.05.62
          </a>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-[#D4A96A] rounded-lg flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0a0a">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-black text-white">ESON<span className="text-[#D4A96A]"> MAROC</span></span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Location de Voitures</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">{t("footer.tagline")}</p>
          <div className="flex gap-2">
            <a href="https://www.facebook.com/esonmaroc" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-[#D4A96A] hover:text-black hover:border-[#D4A96A] transition-all">
              <Facebook size={15} />
            </a>
            <a href="https://www.instagram.com/esonmaroc" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-[#D4A96A] hover:text-black hover:border-[#D4A96A] transition-all">
              <Instagram size={15} />
            </a>
            <a href="https://wa.me/212666890899" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all">
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t("footer.nav")}</h4>
          <ul className="space-y-3 text-sm">
            {[
              { href: "/", label: t("nav.home") },
              { href: "/fleet", label: t("nav.fleet") },
              { href: "/partenaires", label: t("nav.partners") },
              { href: "/excursions", label: t("nav.excursions") },
              { href: "/about", label: t("nav.about") },
              { href: "/contact", label: t("nav.contact") },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-gray-500 hover:text-[#D4A96A] transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#D4A96A] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Fleet */}
        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t("footer.vehicles")}</h4>
          <ul className="space-y-3 text-sm">
            {FLEET_CATEGORIES.map(({ label, query }) => (
              <li key={query}>
                <Link href={`/fleet?category=${encodeURIComponent(query)}`}
                  className="text-gray-500 hover:text-[#D4A96A] transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#D4A96A] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Excursions */}
        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t("footer.excursions")}</h4>
          <ul className="space-y-3 text-sm">
            {EXCURSION_CATEGORIES.map(({ label, cat }) => (
              <li key={cat}>
                <Link href={`/excursions?category=${encodeURIComponent(cat)}`}
                  className="text-gray-500 hover:text-[#D4A96A] transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-[#D4A96A] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t("footer.contact")}</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3 text-gray-500">
              <MapPin size={15} className="text-[#D4A96A] mt-0.5 shrink-0" />
              <span>Av. Mohamed VI, en face de la RAM,<br />Ouarzazate, Maroc</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={15} className="text-[#D4A96A] shrink-0" />
              <a href="tel:+212524890562" className="text-gray-500 hover:text-white transition-colors">+212.524.89.05.62</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={15} className="text-[#D4A96A] shrink-0" />
              <a href="mailto:contact@eson-maroc.com" className="text-gray-500 hover:text-white transition-colors">contact@eson-maroc.com</a>
            </li>
          </ul>
          <div className="mt-6 flex items-center gap-2 bg-[#D4A96A]/10 border border-[#D4A96A]/20 rounded-xl px-4 py-3">
            <span className="w-2 h-2 bg-[#D4A96A] rounded-full animate-pulse" />
            <span className="text-[#D4A96A] text-xs font-semibold">{t("footer.open")}</span>
          </div>
        </div>
      </div>

      {/* Trust & Payment badges */}
      <div className="border-t border-white/8 w-full px-4 sm:px-6 py-6">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          {[
            { icon: "🛡️", label: "Assurance incluse" },
            { icon: "🏅", label: "Agence agréée 2003" },
            { icon: "💵", label: "Paiement Cash" },
            { icon: "🏦", label: "Virement bancaire" },
            { icon: "✅", label: "Véhicules contrôlés" },
            { icon: "🔐", label: "Données sécurisées" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-gray-600 text-[11px]">
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600 gap-3">
          <p>{t("footer.rights")}</p>
          <p>{t("footer.madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}
