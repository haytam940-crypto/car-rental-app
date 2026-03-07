import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchWidget from "@/components/SearchWidget";
import CarCard from "@/components/CarCard";
import MIcon from "@/components/MIcon";
import HeroSlider from "@/components/HeroSlider";
import { CARS } from "@/lib/data";
import { Shield, Clock, MapPin, Star, ChevronRight, Check, Phone } from "lucide-react";

const WHY_US = [
  { icon: "directions_car", title: "Flotte Premium", desc: "Du petit citadin au SUV de luxe, véhicules récents et parfaitement entretenus." },
  { icon: "bolt", title: "Réservation Rapide", desc: "Réservez en 2 minutes en ligne. Confirmation immédiate, sans attente." },
  { icon: "verified_user", title: "Assurance Incluse", desc: "Tous nos véhicules sont assurés tous risques. Roulez en toute sérénité." },
  { icon: "local_shipping", title: "Livraison Partout", desc: "Livraison à l'aéroport, hôtel ou bureau. Partout au Maroc." },
  { icon: "payments", title: "Prix Transparents", desc: "Aucun frais caché. Le prix affiché est le prix final, tout inclus." },
  { icon: "support_agent", title: "Support 24h/24", desc: "Notre équipe est disponible à toute heure pour vous accompagner." },
];

const STEPS = [
  { num: "01", title: "Choisissez votre véhicule", desc: "Parcourez notre flotte et sélectionnez le véhicule qui correspond à vos besoins." },
  { num: "02", title: "Remplissez le formulaire", desc: "Indiquez vos dates, lieux de prise en charge et informations personnelles." },
  { num: "03", title: "Confirmez et roulez", desc: "Recevez votre confirmation et prenez la route en toute sérénité." },
];

const TESTIMONIALS = [
  { name: "Youssef El Amrani", city: "Casablanca", rating: 5, text: "Service impeccable, voiture livrée à l'heure à l'aéroport. Je recommande vivement AutoLoc pour tous vos déplacements au Maroc." },
  { name: "Sarah Dupont", city: "Paris → Marrakech", rating: 5, text: "Parfait pour mon voyage au Maroc ! Voiture propre, récente, prix imbattable. Le personnel est très professionnel." },
  { name: "Mohamed Tazi", city: "Rabat", rating: 5, text: "J'utilise AutoLoc régulièrement pour mes déplacements pro. Toujours ponctuel et véhicule en excellent état." },
];

export default function HomePage() {
  const featuredCars = CARS.filter((c) => c.status === "available").slice(0, 4);
  const availableCount = CARS.filter((c) => c.status === "available").length;

  return (
    <main className="bg-[#0a0a0a]">
      <Header />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <HeroSlider />

        <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-20 w-full" style={{ zIndex: 10 }}>
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#F5C518]/10 border border-[#F5C518]/30 text-[#F5C518] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 bg-[#F5C518] rounded-full animate-pulse" />
              {availableCount} véhicules disponibles au Maroc
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
              Louez la voiture<br />
              <span className="text-[#F5C518]">de vos rêves</span><br />
              au Maroc
            </h1>

            <p className="text-gray-400 text-lg max-w-xl leading-relaxed mb-10">
              Large choix de véhicules récents, prix transparents, livraison partout.
              Réservez en ligne en 2 minutes.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5 mb-12">
              {[
                { icon: Shield, text: "Assurance tous risques" },
                { icon: Clock, text: "Disponible 24h/24" },
                { icon: Star, text: "Note 4.9/5" },
                { icon: MapPin, text: "10+ villes" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-400">
                  <Icon size={14} className="text-[#F5C518]" />
                  {text}
                </div>
              ))}
            </div>

            {/* Search widget */}
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────────────── */}
      <section className="bg-[#111111] border-y border-white/8 py-14">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: `${CARS.length}+`, label: "Véhicules", sub: "dans notre flotte" },
            { value: "10+", label: "Villes", sub: "au Maroc" },
            { value: "500+", label: "Clients", sub: "satisfaits" },
            { value: "4.9★", label: "Note", sub: "sur 5 étoiles" },
          ].map(({ value, label, sub }) => (
            <div key={label} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-[#F5C518] mb-1">{value}</div>
              <div className="text-white font-semibold text-sm">{label}</div>
              <div className="text-gray-600 text-xs mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURED CARS ───────────────────────────────────────────── */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#F5C518] text-xs font-bold uppercase tracking-widest mb-3">Notre sélection</p>
              <h2 className="text-4xl md:text-5xl font-black text-white">Véhicules à la une</h2>
            </div>
            <Link href="/fleet" className="hidden md:flex items-center gap-2 text-[#F5C518] font-semibold text-sm hover:gap-3 transition-all">
              Voir tous les véhicules <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link href="/fleet" className="inline-flex items-center gap-2 yellow-btn px-8 py-4 rounded-xl font-bold">
              Voir toute la flotte <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-24 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#F5C518] text-xs font-bold uppercase tracking-widest mb-3">Simple et rapide</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">Comment ça marche ?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-[#F5C518]/30" />
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="text-center relative">
                <div className="w-20 h-20 bg-[#F5C518] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/20">
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — image */}
            <div className="relative rounded-2xl overflow-hidden h-[500px]">
              <img
                src="/marrakech.jpg"
                alt="Voitures AutoLoc"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {/* Floating card */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F5C518] rounded-xl flex items-center justify-center shrink-0">
                  <Star size={22} className="text-black fill-black" />
                </div>
                <div>
                  <p className="text-white font-bold">500+ clients satisfaits</p>
                  <p className="text-gray-400 text-xs">Note moyenne de 4.9/5 étoiles</p>
                </div>
              </div>
            </div>

            {/* Right — content */}
            <div>
              <p className="text-[#F5C518] text-xs font-bold uppercase tracking-widest mb-3">Pourquoi nous choisir</p>
              <h2 className="text-4xl font-black text-white mb-5 leading-tight">
                L&apos;expérience<br />AutoLoc Maroc
              </h2>
              <p className="text-gray-500 leading-relaxed mb-10">
                Depuis plusieurs années, AutoLoc Maroc est la référence en matière de location de voitures.
                Nous vous offrons un service premium à des prix accessibles.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {WHY_US.map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-11 h-11 bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-xl flex items-center justify-center shrink-0">
                      <MIcon name={icon} size={22} fill className="text-[#F5C518]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/fleet" className="inline-flex items-center gap-2 yellow-btn mt-10 px-8 py-4 rounded-xl font-bold">
                Voir nos véhicules <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-24 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#F5C518] text-xs font-bold uppercase tracking-widest mb-3">Témoignages</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">Ce que disent nos clients</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, city, rating, text }) => (
              <div key={name} className="card-dark p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-[#F5C518] fill-[#F5C518]" />
                  ))}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 italic">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                  <div className="w-10 h-10 rounded-full bg-[#F5C518]/20 flex items-center justify-center text-[#F5C518] font-bold text-sm">
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
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1597212618440-806262de4f2b?w=1920')" }}
        />
        <div className="absolute inset-0 bg-black/85" />
        <div className="absolute inset-0 bg-[#F5C518]/5" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#F5C518] text-xs font-bold uppercase tracking-widest mb-4">Prêt à partir ?</p>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Réservez votre voiture<br />dès maintenant
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Des centaines de clients nous font confiance. Rejoignez-les.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fleet" className="yellow-btn px-10 py-4 rounded-xl font-bold text-base flex items-center gap-2 justify-center">
              Voir les voitures <ChevronRight size={18} />
            </Link>
            <a href="tel:+212600000000" className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-white/20 transition-colors">
              <Phone size={18} />
              +212 6 00 00 00 00
            </a>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-gray-500 text-xs">
            {["Annulation gratuite", "Aucun frais caché", "Paiement sécurisé", "Support 24h/24"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={12} className="text-[#F5C518]" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
