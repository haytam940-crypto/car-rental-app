"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchWidget from "@/components/SearchWidget";
import CarCard from "@/components/CarCard";
import MIcon from "@/components/MIcon";
import HeroSlider from "@/components/HeroSlider";
import { CARS, Excursion } from "@/lib/data";
import { getMergedExcursions, getActivePromotion } from "@/lib/store";
import { Shield, Clock, MapPin, Star, ChevronRight, Check, Phone, Mountain, Users, ArrowRight, Car, Zap, ShieldCheck, Truck, CreditCard, Headphones } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const difficultyStyle: Record<string, string> = {
  Facile:   "bg-green-500/15 text-green-400 border border-green-500/20",
  Modéré:   "bg-[#D4A96A]/15 text-[#D4A96A] border border-[#D4A96A]/20",
  Difficile:"bg-red-500/15 text-red-400 border border-red-500/20",
};
const categoryIcon: Record<string, string> = {
  Désert: "🏜️", Montagne: "🏔️", Côte: "🌊", Ville: "🕌", Circuit: "🗺️",
};

export default function HomePage() {
  const { t } = useLanguage();
  const featuredCars = CARS.filter((c) => c.status === "available").slice(0, 4);
  const availableCount = CARS.filter((c) => c.status === "available").length;
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [promoDiscount, setPromoDiscount] = useState(0);

  useEffect(() => {
    setExcursions(getMergedExcursions().slice(0, 3));
    const promo = getActivePromotion();
    if (promo && (promo.applyTo === "excursions" || promo.applyTo === "all")) {
      setPromoDiscount(promo.discountPercent);
    }
  }, []);

  const excHT = (base: number) =>
    promoDiscount > 0 ? Math.round(base * (1 - promoDiscount / 100)) : base;

  const WHY_US = [
    { icon: Car,          title: t("home.whyUs.fleet"),     desc: t("home.whyUs.fleetDesc") },
    { icon: Zap,          title: t("home.whyUs.booking"),   desc: t("home.whyUs.bookingDesc") },
    { icon: ShieldCheck,  title: t("home.whyUs.insurance"), desc: t("home.whyUs.insuranceDesc") },
    { icon: Truck,        title: t("home.whyUs.delivery"),  desc: t("home.whyUs.deliveryDesc") },
    { icon: CreditCard,   title: t("home.whyUs.price"),     desc: t("home.whyUs.priceDesc") },
    { icon: Headphones,   title: t("home.whyUs.support"),   desc: t("home.whyUs.supportDesc") },
  ];

  const STEPS = [
    { num: "01", title: t("home.howItWorks.step1Title"), desc: t("home.howItWorks.step1Desc") },
    { num: "02", title: t("home.howItWorks.step2Title"), desc: t("home.howItWorks.step2Desc") },
    { num: "03", title: t("home.howItWorks.step3Title"), desc: t("home.howItWorks.step3Desc") },
  ];

  const TESTIMONIALS = [
    { name: "Youssef El Amrani", city: "Casablanca", rating: 5, text: "Service impeccable, voiture livrée à l'heure à l'aéroport. Je recommande vivement Eson Maroc pour tous vos déplacements au Maroc." },
    { name: "Sarah Dupont", city: "Paris → Marrakech", rating: 5, text: "Parfait pour mon voyage au Maroc ! Voiture propre, récente, prix imbattable. Le personnel est très professionnel." },
    { name: "Mohamed Tazi", city: "Rabat", rating: 5, text: "J'utilise Eson Maroc régulièrement pour mes déplacements pro. Toujours ponctuel et véhicule en excellent état." },
  ];

  return (
    <main className="bg-[#0a0a0a]">
      <Header />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <HeroSlider />

        <div className="relative w-full px-4 sm:px-6 pt-32 pb-20 w-full" style={{ zIndex: 10 }}>
          <div className="max-w-3xl">

            {/* Badge — apparaît en 1er après la photo */}
            <div
              className="animate-fade-in-up inline-flex items-center gap-2 bg-[#D4A96A]/10 border border-[#D4A96A]/30 text-[#D4A96A] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
              style={{ animationDelay: "1.2s" }}
            >
              <span className="w-1.5 h-1.5 bg-[#D4A96A] rounded-full animate-pulse" />
              {availableCount} {t("home.badge")}
            </div>

            {/* Titre — 2e élément */}
            <h1
              className="animate-fade-in-up text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight"
              style={{ animationDelay: "2.0s" }}
            >
              {t("home.hero.title1")}<br />
              <span className="text-[#D4A96A]">{t("home.hero.title2")}</span><br />
              {t("home.hero.title3")}
            </h1>

            {/* Sous-titre */}
            <p
              className="animate-fade-in-up text-gray-400 text-lg max-w-xl leading-relaxed mb-10"
              style={{ animationDelay: "2.8s" }}
            >
              {t("home.hero.sub")}
            </p>

            {/* Trust badges */}
            <div
              className="animate-fade-in-up flex flex-wrap gap-5 mb-12"
              style={{ animationDelay: "3.4s" }}
            >
              {[
                { icon: Shield, text: t("home.trust.insurance") },
                { icon: Clock, text: t("home.trust.available") },
                { icon: Star, text: t("home.trust.rating") },
                { icon: MapPin, text: t("home.trust.cities") },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-400">
                  <Icon size={14} className="text-[#D4A96A]" />
                  {text}
                </div>
              ))}
            </div>

            {/* Formulaire de recherche — dernier */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "4.1s" }}
            >
              <SearchWidget />
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────────────── */}
      <section className="bg-[#111111] border-y border-white/8 py-14">
        <div className="w-full px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: `${CARS.length}+`, label: t("home.stats.vehicles"), sub: t("home.stats.vehiclesSub") },
            { value: "10+", label: t("home.stats.cities"), sub: t("home.stats.citiesSub") },
            { value: "500+", label: t("home.stats.clients"), sub: t("home.stats.clientsSub") },
            { value: "4.9★", label: t("home.stats.rating"), sub: t("home.stats.ratingSub") },
          ].map(({ value, label, sub }) => (
            <div key={label} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-[#D4A96A] mb-1">{value}</div>
              <div className="text-white font-semibold text-sm">{label}</div>
              <div className="text-gray-600 text-xs mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURED CARS ───────────────────────────────────────────── */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="w-full px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest mb-3">{t("home.featured.tag")}</p>
              <h2 className="text-4xl md:text-5xl font-black text-white">{t("home.featured.title")}</h2>
            </div>
            <Link href="/fleet" className="hidden md:flex items-center gap-2 text-[#D4A96A] font-semibold text-sm hover:gap-3 transition-all">
              {t("home.featured.seeAll")} <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link href="/fleet" className="inline-flex items-center gap-2 yellow-btn px-8 py-4 rounded-xl font-bold">
              {t("home.featured.seeAllMobile")} <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── EXCURSIONS ───────────────────────────────────────────────── */}
      <section className="py-24 bg-[#111111]">
        <div className="w-full px-4 sm:px-6">
          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest mb-3">{t("home.excursions.tag")}</p>
              <h2 className="text-4xl md:text-5xl font-black text-white">{t("home.excursions.title")}</h2>
              <p className="text-gray-500 text-sm mt-3 max-w-xl">{t("home.excursions.sub")}</p>
            </div>
            <Link href="/excursions" className="hidden md:flex items-center gap-2 text-[#D4A96A] font-semibold text-sm hover:gap-3 transition-all shrink-0">
              {t("home.excursions.seeAll")} <ChevronRight size={16} />
            </Link>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {excursions.map((exc) => {
              const ht = excHT(exc.pricePerPerson);
              const ttc = Math.round(ht * 1.2);
              const hasPromo = promoDiscount > 0;
              return (
                <div key={exc.id} className="card-dark group overflow-hidden flex flex-col">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-[#1a1a1a] shrink-0">
                    <img
                      src={exc.image}
                      alt={exc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* Category */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full">
                      <span className="text-xs">{categoryIcon[exc.category]}</span>
                      <span className="text-white text-xs font-semibold">{exc.category}</span>
                    </div>

                    {/* Difficulty */}
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${difficultyStyle[exc.difficulty]}`}>
                        {exc.difficulty}
                      </span>
                    </div>

                    {/* Promo badge */}
                    {hasPromo && (
                      <div className="absolute bottom-3 left-3 bg-green-400 text-black text-xs font-black px-2 py-0.5 rounded-md">
                        -{promoDiscount}% PROMO
                      </div>
                    )}

                    {/* Duration */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      <Clock size={11} className="text-[#D4A96A]" />
                      <span className="text-white text-xs font-medium">{exc.duration}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                        <MapPin size={11} className="text-[#D4A96A]" />
                        {exc.destination}
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">{exc.title}</h3>
                    </div>

                    <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1 line-clamp-2">{exc.description}</p>

                    {/* Includes preview */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {exc.includes.slice(0, 3).map((inc) => (
                        <span key={inc} className="text-[10px] bg-white/5 border border-white/8 text-gray-400 px-2 py-0.5 rounded-full">{inc}</span>
                      ))}
                      {exc.includes.length > 3 && (
                        <span className="text-[10px] text-gray-600">+{exc.includes.length - 3}</span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/8">
                      <div>
                        {hasPromo && (
                          <div className="text-[11px] text-gray-600 line-through">{exc.pricePerPerson} DH HT</div>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-[#D4A96A]">{ht}</span>
                          <span className="text-xs text-gray-400">DH HT{t("home.excursions.perPerson")}</span>
                        </div>
                        <div className="text-[11px] text-gray-600">{ttc} DH TTC</div>
                      </div>
                      <Link
                        href="/excursions"
                        className="flex items-center gap-1.5 bg-[#D4A96A] hover:bg-[#b8894e] text-black text-xs font-bold px-4 py-2.5 rounded-lg transition-all hover:-translate-y-0.5"
                      >
                        {t("home.excursions.book")} <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile CTA */}
          <div className="text-center mt-10 md:hidden">
            <Link href="/excursions" className="inline-flex items-center gap-2 yellow-btn px-8 py-4 rounded-xl font-bold">
              {t("home.excursions.seeAllMobile")} <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-24 bg-[#111111]">
        <div className="w-full px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest mb-3">{t("home.howItWorks.tag")}</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">{t("home.howItWorks.title")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-[#D4A96A]/30" />
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="text-center relative">
                <div className="w-20 h-20 bg-[#D4A96A] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-900/20">
                  <span className="text-2xl font-black text-black">{num}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY US ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="w-full px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden h-[500px]">
              <img src="/marrakech.jpg" alt="Eson Maroc Maroc" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#D4A96A] rounded-xl flex items-center justify-center shrink-0">
                  <Star size={22} className="text-black fill-black" />
                </div>
                <div>
                  <p className="text-white font-bold">{t("home.whyUs.clients")}</p>
                  <p className="text-gray-400 text-xs">{t("home.whyUs.clientsSub")}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest mb-3">{t("home.whyUs.tag")}</p>
              <h2 className="text-4xl font-black text-white mb-5 leading-tight">{t("home.whyUs.title")}</h2>
              <p className="text-gray-500 leading-relaxed mb-10">{t("home.whyUs.sub")}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {WHY_US.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-11 h-11 bg-[#D4A96A]/10 border border-[#D4A96A]/20 rounded-xl flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-[#D4A96A]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/fleet" className="inline-flex items-center gap-2 yellow-btn mt-10 px-8 py-4 rounded-xl font-bold">
                {t("home.whyUs.seeVehicles")} <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-24 bg-[#111111]">
        <div className="w-full px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest mb-3">{t("home.testimonials.tag")}</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">{t("home.testimonials.title")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, city, rating, text }) => (
              <div key={name} className="card-dark p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-[#D4A96A] fill-[#D4A96A]" />
                  ))}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 italic">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                  <div className="w-10 h-10 rounded-full bg-[#D4A96A]/20 flex items-center justify-center text-[#D4A96A] font-bold text-sm">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{name}</p>
                    <p className="text-gray-600 text-xs">{city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1597212618440-806262de4f2b?w=1920')" }} />
        <div className="absolute inset-0 bg-black/85" />
        <div className="absolute inset-0 bg-[#D4A96A]/5" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest mb-4">{t("home.cta.tag")}</p>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight whitespace-pre-line">
            {t("home.cta.title")}
          </h2>
          <p className="text-gray-400 text-lg mb-10">{t("home.cta.sub")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fleet" className="yellow-btn px-10 py-4 rounded-xl font-bold text-base flex items-center gap-2 justify-center">
              {t("home.cta.seeCars")} <ChevronRight size={18} />
            </Link>
            <a href="tel:+212524890562" className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-white/20 transition-colors">
              <Phone size={18} />
              +212.524.89.05.62
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-12 text-gray-500 text-xs">
            {[t("home.cta.cancel"), t("home.cta.noFees"), t("home.cta.secure"), t("home.cta.support")].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check size={12} className="text-[#D4A96A]" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
