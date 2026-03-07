import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MIcon from "@/components/MIcon";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const VALUES = [
  { icon: "verified_user", title: "Fiabilité", desc: "Nos véhicules sont contrôlés et assurés avant chaque location. Votre sécurité est notre priorité absolue." },
  { icon: "handshake", title: "Transparence", desc: "Aucun frais caché. Le prix que vous voyez est le prix que vous payez, tout inclus." },
  { icon: "support_agent", title: "Disponibilité", desc: "Notre équipe est joignable 7j/7 de 8h à 22h pour répondre à toutes vos questions." },
  { icon: "location_on", title: "Proximité", desc: "Nous intervenons dans les principales villes du Maroc et livrons directement à votre adresse." },
];

const TEAM = [
  { name: "Youssef Rachidi", role: "Fondateur & Directeur", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" },
  { name: "Fatima Benali", role: "Responsable Opérations", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300" },
  { name: "Karim Tazi", role: "Responsable Flotte", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300" },
];

export default function AboutPage() {
  return (
    <main className="bg-[#0a0a0a]">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1597212618440-806262de4f2b?w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 to-[#0a0a0a]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#F5C518] text-xs font-bold uppercase tracking-widest mb-3">Notre histoire</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">À propos d&apos;AutoLoc Maroc</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Depuis 2015, AutoLoc Maroc accompagne les voyageurs et les professionnels
            dans leurs déplacements à travers le Royaume. Notre mission : rendre la location
            de voitures simple, transparente et accessible à tous.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#111111] border-y border-white/8 py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "10+", label: "Ans d'expérience" },
            { value: "500+", label: "Clients satisfaits" },
            { value: "50+", label: "Véhicules en flotte" },
            { value: "10", label: "Villes couvertes" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-black text-[#F5C518] mb-1">{value}</div>
              <div className="text-gray-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#F5C518] text-xs font-bold uppercase tracking-widest mb-3">Notre parcours</p>
            <h2 className="text-3xl font-black text-white mb-5">Une agence née de la passion de l&apos;automobile</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              AutoLoc Maroc a été fondée à Casablanca avec une vision claire : offrir aux marocains
              et aux touristes une expérience de location de voitures moderne, digitale et sans friction.
            </p>
            <p className="text-gray-500 leading-relaxed mb-6">
              Aujourd&apos;hui nous opérons dans 10 villes avec une flotte de plus de 50 véhicules,
              allant de la citadine économique au SUV de luxe. Chaque véhicule est régulièrement
              entretenu et assuré tous risques.
            </p>
            <Link href="/fleet" className="inline-flex items-center gap-2 yellow-btn px-6 py-3 rounded-xl font-semibold">
              <MIcon name="directions_car" size={18} />
              Voir notre flotte
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden h-80 border border-white/8">
            <img
              src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800"
              alt="Notre agence"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#F5C518] text-xs font-bold uppercase tracking-widest mb-3">Ce qui nous guide</p>
            <h2 className="text-3xl font-black text-white">Nos valeurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="card-dark p-7 group">
                <div className="w-12 h-12 bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#F5C518] transition-colors">
                  <MIcon name={icon} size={24} fill className="text-[#F5C518] group-hover:text-black transition-colors" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#F5C518] text-xs font-bold uppercase tracking-widest mb-3">Notre équipe</p>
            <h2 className="text-3xl font-black text-white">Les personnes derrière AutoLoc</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {TEAM.map(({ name, role, img }) => (
              <div key={name} className="text-center group">
                <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white/10 group-hover:border-[#F5C518] transition-colors">
                  <img src={img} alt={name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-white">{name}</h3>
                <p className="text-gray-500 text-sm">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#111111] border-t border-white/8 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-black text-white mb-4">Prêt à partir avec nous ?</h2>
          <p className="text-gray-500 mb-8">Réservez votre voiture en ligne en 2 minutes.</p>
          <Link href="/fleet" className="yellow-btn px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2">
            Voir les voitures disponibles <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
