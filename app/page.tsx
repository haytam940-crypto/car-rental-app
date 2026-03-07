import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchWidget from "@/components/SearchWidget";
import CarCard from "@/components/CarCard";
import MIcon from "@/components/MIcon";
import { CARS } from "@/lib/data";
import { Shield, Clock, MapPin, Star, ChevronRight } from "lucide-react";

const WHY_US = [
  { icon: "directions_car", title: "Flotte diversifiée", desc: "Du petit citadin économique au SUV de luxe, nous avons le véhicule parfait pour chaque besoin et budget." },
  { icon: "bolt", title: "Réservation instantanée", desc: "Réservez en ligne en 2 minutes. Confirmation immédiate, aucune surprise a la prise en charge." },
  { icon: "verified_user", title: "Assurance complète", desc: "Tous nos véhicules sont assurés tous risques. Roulez en toute sérénité ou que vous alliez." },
  { icon: "local_shipping", title: "Livraison partout", desc: "Livraison et récupération à l'adresse de votre choix, aéroport, hôtel ou bureau." },
  { icon: "payments", title: "Prix transparents", desc: "Aucun frais caché. Le prix affiché est le prix final, tout inclus." },
  { icon: "support_agent", title: "Assistance 24h/24", desc: "Notre équipe est disponible à toute heure pour vous accompagner en cas de besoin." },
];

export default function HomePage() {
  const featuredCars = CARS.filter((c) => c.status === "available").slice(0, 4);
  const availableCount = CARS.filter((c) => c.status === "available").length;

  return (
    <main>
      <Header />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/80 via-[#1a1a2e]/70 to-[#1a1a2e]/90" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-28 pb-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#e63946]/20 border border-[#e63946]/40 text-[#e63946] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-[#e63946] rounded-full animate-pulse" />
              {availableCount} voitures disponibles maintenant
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
              Louez une voiture<br />
              <span className="text-[#e63946]">au Maroc</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Large choix de véhicules, prix transparents, réservation en ligne en 2 minutes.
              Disponible 7j/7 dans toutes les grandes villes.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <SearchWidget />
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/70 text-sm">
            {[
              { icon: Shield, text: "Assurance incluse" },
              { icon: Clock, text: "Disponible 24h/24" },
              { icon: MapPin, text: "Livraison possible" },
              { icon: Star, text: "4.9/5 avis clients" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon size={16} className="text-[#e63946]" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#1a1a2e] py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: `${CARS.length}+`, label: "Véhicules" },
            { value: "10+", label: "Villes" },
            { value: "500+", label: "Clients satisfaits" },
            { value: "4.9", label: "Note moyenne" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl md:text-4xl font-black text-[#e63946] mb-1">{value}</div>
              <div className="text-gray-400 text-sm font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#e63946] text-sm font-semibold uppercase tracking-wider mb-2">Notre flotte</p>
              <h2 className="text-4xl font-black text-[#1a1a2e]">Véhicules à la une</h2>
            </div>
            <Link href="/fleet" className="hidden md:flex items-center gap-2 text-[#e63946] font-semibold text-sm hover:gap-3 transition-all">
              Voir tous les véhicules <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link href="/fleet" className="inline-flex items-center gap-2 bg-[#e63946] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#c1121f] transition-colors">
              Voir toute la flotte <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#e63946] text-sm font-semibold uppercase tracking-wider mb-2">Pourquoi nous choisir</p>
            <h2 className="text-4xl font-black text-[#1a1a2e]">L&apos;expérience AutoLoc</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_US.map(({ icon, title, desc }) => (
              <div key={title} className="p-8 rounded-2xl border border-gray-100 hover:border-[#e63946]/30 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-[#e63946]/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#e63946] transition-colors">
                  <MIcon
                    name={icon}
                    size={28}
                    fill
                    className="text-[#e63946] group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="text-lg font-bold text-[#1a1a2e] mb-3 group-hover:text-[#e63946] transition-colors">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 bg-[#1a1a2e] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920')" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Prêt a prendre la route ?</h2>
          <p className="text-gray-400 text-lg mb-10">Réservez votre véhicule en ligne ou contactez-nous directement.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fleet" className="bg-[#e63946] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#c1121f] transition-colors">
              Voir les voitures
            </Link>
            <a href="tel:+212600000000" className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors">
              +212 6 00 00 00 00
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
