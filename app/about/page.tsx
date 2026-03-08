"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MIcon from "@/components/MIcon";
import Link from "next/link";
import { ChevronRight, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  const VALUES = [
    { icon: "verified_user",  title: t("about.val.reliability"),  desc: t("about.val.reliabilityDesc") },
    { icon: "handshake",      title: t("about.val.transparency"),  desc: t("about.val.transparencyDesc") },
    { icon: "support_agent",  title: t("about.val.availability"),  desc: t("about.val.availabilityDesc") },
    { icon: "local_shipping", title: t("about.val.proximity"),     desc: t("about.val.proximityDesc") },
  ];

  const SERVICES = [
    { icon: "flight_land",      title: t("about.svc.delivery"), desc: t("about.svc.deliveryDesc") },
    { icon: "directions_car",   title: t("about.svc.fleet"),    desc: t("about.svc.fleetDesc") },
    { icon: "business_center",  title: t("about.svc.lld"),      desc: t("about.svc.lldDesc") },
    { icon: "explore",          title: t("about.svc.guide"),    desc: t("about.svc.guideDesc") },
  ];

  return (
    <main className="bg-[#0a0a0a]">
      <Header />

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 to-[#0a0a0a]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest mb-3">{t("about.hero.tag")}</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">{t("about.hero.title")}</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">{t("about.hero.sub")}</p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-[#111111] border-y border-white/8 py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "20+", label: t("about.stats.exp") },
            { value: "500+", label: t("about.stats.clients") },
            { value: "50+", label: t("about.stats.fleet") },
            { value: "10+", label: t("about.stats.cities") },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl md:text-4xl font-black text-[#D4A96A] mb-1">{value}</div>
              <div className="text-gray-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Notre Histoire ── */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden h-[420px] border border-white/8 order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1590802163243-290dd8621032?w=800"
              alt="Agence Eson Maroc Ouarzazate"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {/* Founding badge */}
            <div className="absolute bottom-5 left-5 bg-[#D4A96A] text-black px-4 py-2 rounded-xl font-black text-sm shadow-lg">
              Fondée en 2003 · Ouarzazate
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <p className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest mb-3">{t("about.mission.tag")}</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">{t("about.mission.title")}</h2>
            <p className="text-gray-400 leading-relaxed mb-5">{t("about.mission.p1")}</p>
            <p className="text-gray-500 leading-relaxed mb-8">{t("about.mission.p2")}</p>

            {/* Timeline pill */}
            <div className="flex items-center gap-3 flex-wrap">
              {["2003 — Création", "Ouarzazate", "Tout le Maroc", "20+ ans d'expertise"].map((item) => (
                <span key={item} className="text-xs bg-white/5 border border-white/10 text-gray-400 px-3 py-1.5 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Hassan — L'accueil ── */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest mb-3">{t("about.welcome.tag")}</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-12">{t("about.welcome.title")}</h2>

          <div className="bg-[#0a0a0a] border border-[#D4A96A]/20 rounded-2xl p-8 text-left">
            <div className="w-10 h-10 bg-[#D4A96A]/10 border border-[#D4A96A]/20 rounded-xl flex items-center justify-center mb-5">
              <Quote size={18} className="text-[#D4A96A]" />
            </div>
            <p className="text-white text-lg font-semibold leading-relaxed mb-5 italic">
              &ldquo;{t("about.welcome.quote")}&rdquo;
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{t("about.welcome.sub")}</p>

            <div className="flex flex-wrap gap-2 pt-5 border-t border-white/8">
              <div className="flex items-center gap-3 mr-4">
                <div className="w-8 h-8 bg-[#D4A96A] rounded-full flex items-center justify-center text-sm font-black text-black">H</div>
                <div>
                  <p className="text-white text-sm font-bold leading-none">Hassan</p>
                  <p className="text-[#D4A96A] text-xs">Fondateur & Directeur · depuis 2003</p>
                </div>
              </div>
              {["Confiance", "Hospitalité", "Proximité", "Verre de thé 🍵"].map((badge) => (
                <span key={badge} className="text-xs bg-[#D4A96A]/10 border border-[#D4A96A]/20 text-[#D4A96A] px-3 py-1.5 rounded-full font-medium">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest mb-3">{t("about.svc.tag")}</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">{t("about.svc.title")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(({ icon, title, desc }) => (
              <div key={title} className="card-dark p-7 group hover:border-[#D4A96A]/30 transition-all">
                <div className="w-12 h-12 bg-[#D4A96A]/10 border border-[#D4A96A]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#D4A96A] transition-colors">
                  <MIcon name={icon} size={24} fill className="text-[#D4A96A] group-hover:text-black transition-colors" />
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Valeurs ── */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest mb-3">{t("about.values.tag")}</p>
            <h2 className="text-3xl font-black text-white">{t("about.values.title")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="card-dark p-7 group">
                <div className="w-12 h-12 bg-[#D4A96A]/10 border border-[#D4A96A]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#D4A96A] transition-colors">
                  <MIcon name={icon} size={24} fill className="text-[#D4A96A] group-hover:text-black transition-colors" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a]/95 to-[#0a0a0a]" />
        <div className="absolute inset-0 border-y border-[#D4A96A]/10" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <div className="text-4xl mb-5">🍵</div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{t("about.cta.title")}</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">{t("about.cta.sub")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fleet" className="yellow-btn px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2 justify-center">
              {t("about.cta.btn")} <ChevronRight size={16} />
            </Link>
            <Link href="/contact" className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
              <MIcon name="phone" size={16} fill className="text-[#D4A96A]" />
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
