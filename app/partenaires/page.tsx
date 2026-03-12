"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";
import { ExternalLink, MapPin, Phone, Mail, ChevronRight, Check, Star, Globe } from "lucide-react";
import MIcon from "@/components/MIcon";
import { useLanguage } from "@/contexts/LanguageContext";

const PARTNERS = [
  {
    id: 1,
    name: "Hôtel MARMAR",
    category: "Hébergement",
    location: "Ouarzazate",
    address: "À 1 km de l'aéroport, près de la gare routière, Ouarzazate",
    website: "www.hotel-marmar.com",
    websiteUrl: "http://www.hotel-marmar.com",
    phone: "+212 5 24 00 00 00",
    description:
      "Un hôtel authentique et familial idéalement situé à Ouarzazate, la porte du désert. À seulement 1 km de l'aéroport, l'Hôtel MARMAR offre un service de qualité et un accueil chaleureux. Situé au carrefour des routes vers Merzouga et Chegaga, il constitue la base idéale pour vos escapades dans le désert marocain.",
    tags: ["Hôtel", "Aéroport proche", "Désert", "Famille"],
    rating: 4.7,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=800",
    icon: "hotel",
  },
  {
    id: 2,
    name: "KSAR BICHA",
    category: "Bivouac & Désert",
    location: "Erg Chebbi — Merzouga",
    address: "Erg Chebbi, près des dunes de Merzouga",
    website: "www.ksarbicha.com",
    websiteUrl: "http://www.ksarbicha.com",
    phone: "+212 6 00 00 00 00",
    description:
      "Niché au pied des dunes mythiques d'Erg Chebbi, Ksar Bicha est un lodge désertique traditionnel construit en pisé, géré par une famille berbère locale. Un endroit magique où vous pouvez vivre une expérience authentique du Sahara : balade en chameau, bivouac sous les étoiles, repas traditionnels et lever du soleil sur les dunes.",
    tags: ["Bivouac", "Camel trekking", "Sahara", "Étoiles", "Berber"],
    rating: 4.9,
    reviews: 214,
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
    icon: "landscape",
  },
  {
    id: 3,
    name: "BAB EL RAID",
    category: "Aventure & Rallye",
    location: "La Rochelle → Marrakech",
    address: "Rallye international — France, Espagne, Maroc",
    website: "www.babelraid.com",
    websiteUrl: "http://www.babelraid.com",
    phone: "+33 5 00 00 00 00",
    description:
      "BAB EL RAID est un rallye humanitaire et solidaire qui relie La Rochelle à Marrakech sur 5 000 km à travers la France, l'Espagne et le Maroc. Plus de 200 participants s'affrontent sur 12 jours d'aventure dans une ambiance conviviale. Une aventure humaine unique, alliant esprit sportif et engagement solidaire au cœur du Maroc.",
    tags: ["Rallye", "Aventure", "Solidarité", "5000 km", "International"],
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800",
    icon: "directions_car",
  },
];

export default function PartenairesPage() {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", activity: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setSent(true);
    setLoading(false);
  };

  const inputCls = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4A96A]/60 transition-colors placeholder-gray-600";

  const HERO_TEXTS: Record<string, { tag: string; title: string; sub: string }> = {
    fr: {
      tag: "Nos Partenaires",
      title: "Un réseau de confiance\nau Maroc",
      sub: "Eson Maroc s'associe aux meilleures adresses du Royaume pour vous offrir une expérience de voyage complète : hébergement, aventure, événements.",
    },
    en: {
      tag: "Our Partners",
      title: "A trusted network\nin Morocco",
      sub: "Eson Maroc partners with the best addresses in the Kingdom to offer you a complete travel experience: accommodation, adventure, events.",
    },
    es: {
      tag: "Nuestros Socios",
      title: "Una red de confianza\nen Marruecos",
      sub: "Eson Maroc se asocia con las mejores direcciones del Reino para ofrecerle una experiencia de viaje completa: alojamiento, aventura, eventos.",
    },
  };

  const BECOME_TEXTS: Record<string, { tag: string; title: string; sub: string; btn: string; fields: Record<string, string>; success: string; successSub: string }> = {
    fr: {
      tag: "Rejoindre le réseau",
      title: "Devenez partenaire Eson Maroc",
      sub: "Vous êtes un hôtel, un tour-opérateur, un guide ou une activité touristique au Maroc ? Rejoignez notre réseau et bénéficiez de notre visibilité.",
      btn: "Envoyer ma candidature",
      fields: { company: "Nom de l'entreprise", name: "Votre nom", email: "Email professionnel", phone: "Téléphone", activity: "Type d'activité", message: "Présentez votre activité..." },
      success: "Candidature envoyée !",
      successSub: "Notre équipe vous contactera sous 48h.",
    },
    en: {
      tag: "Join the network",
      title: "Become an Eson Maroc partner",
      sub: "Are you a hotel, tour operator, guide or tourist activity in Morocco? Join our network and benefit from our visibility.",
      btn: "Send my application",
      fields: { company: "Company name", name: "Your name", email: "Professional email", phone: "Phone", activity: "Type of activity", message: "Describe your activity..." },
      success: "Application sent!",
      successSub: "Our team will contact you within 48h.",
    },
    es: {
      tag: "Únase a la red",
      title: "Conviértase en socio de Eson Maroc",
      sub: "¿Es usted un hotel, operador turístico, guía o actividad turística en Marruecos? Únase a nuestra red y benefíciese de nuestra visibilidad.",
      btn: "Enviar mi candidatura",
      fields: { company: "Nombre de la empresa", name: "Su nombre", email: "Email profesional", phone: "Teléfono", activity: "Tipo de actividad", message: "Presente su actividad..." },
      success: "¡Candidatura enviada!",
      successSub: "Nuestro equipo le contactará en 48h.",
    },
  };

  const hero = HERO_TEXTS[lang] ?? HERO_TEXTS.fr;
  const become = BECOME_TEXTS[lang] ?? BECOME_TEXTS.fr;

  return (
    <main className="bg-[#0a0a0a]">
      <Header />

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 to-[#0a0a0a]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <p className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest mb-3">{hero.tag}</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight whitespace-pre-line">
            {hero.title}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">{hero.sub}</p>

          {/* Stats */}
          <div className="flex justify-center gap-10 mt-10">
            {[
              { value: "3+", label: lang === "fr" ? "Partenaires actifs" : lang === "en" ? "Active partners" : "Socios activos" },
              { value: "10+", label: lang === "fr" ? "Villes au Maroc" : lang === "en" ? "Cities in Morocco" : "Ciudades en Marruecos" },
              { value: "100%", label: lang === "fr" ? "Sélectionnés" : lang === "en" ? "Hand-picked" : "Seleccionados" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-[#D4A96A]">{value}</div>
                <div className="text-gray-500 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNER CARDS ──────────────────────────────────── */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="w-full px-4 sm:px-6 space-y-10">
          {PARTNERS.map((p, i) => (
            <div
              key={p.id}
              className={`bg-[#111111] border border-white/8 rounded-3xl overflow-hidden flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
            >
              {/* Image */}
              <div className="relative lg:w-2/5 h-64 lg:h-auto shrink-0 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#D4A96A] text-black text-xs font-black px-3 py-1.5 rounded-full">
                    {p.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                  <Star size={12} className="text-[#D4A96A] fill-[#D4A96A]" />
                  <span className="text-white text-xs font-bold">{p.rating}</span>
                  <span className="text-gray-400 text-xs">({p.reviews})</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 bg-[#D4A96A]/10 border border-[#D4A96A]/20 rounded-xl flex items-center justify-center">
                          <MIcon name={p.icon} size={18} fill className="text-[#D4A96A]" />
                        </div>
                        <span className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest">{p.category}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-white">{p.name}</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-5">
                    <MapPin size={14} className="text-[#D4A96A] shrink-0" />
                    {p.location}
                  </div>

                  <p className="text-gray-400 leading-relaxed text-sm mb-6">{p.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.tags.map((tag) => (
                      <span key={tag} className="bg-white/5 border border-white/10 text-gray-400 text-xs px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer links */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-5 border-t border-white/8">
                  <a
                    href={p.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#D4A96A] font-semibold text-sm hover:underline"
                  >
                    <Globe size={15} />
                    {p.website}
                    <ExternalLink size={12} />
                  </a>
                  <a
                    href={`tel:${p.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    <Phone size={14} className="text-[#D4A96A]" />
                    {p.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BECOME A PARTNER ───────────────────────────────── */}
      <section className="py-20 bg-[#111111] border-t border-white/8">
        <div className="w-full px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

          {/* Left — pitch */}
          <div>
            <p className="text-[#D4A96A] text-xs font-bold uppercase tracking-widest mb-3">{become.tag}</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">{become.title}</h2>
            <p className="text-gray-400 leading-relaxed mb-8">{become.sub}</p>

            <div className="space-y-4">
              {[
                { icon: "visibility", title: lang === "fr" ? "Visibilité accrue" : lang === "en" ? "Increased visibility" : "Mayor visibilidad", desc: lang === "fr" ? "Présentez votre activité à nos milliers de clients chaque mois." : lang === "en" ? "Present your activity to our thousands of clients each month." : "Presente su actividad a nuestros miles de clientes cada mes." },
                { icon: "handshake", title: lang === "fr" ? "Partenariat gagnant-gagnant" : lang === "en" ? "Win-win partnership" : "Asociación ganar-ganar", desc: lang === "fr" ? "Renvoi de clients mutuels et co-promotion sur nos réseaux." : lang === "en" ? "Mutual client referrals and co-promotion on our networks." : "Referencias mutuas de clientes y co-promoción en nuestras redes." },
                { icon: "support_agent", title: lang === "fr" ? "Accompagnement dédié" : lang === "en" ? "Dedicated support" : "Apoyo dedicado", desc: lang === "fr" ? "Un contact direct avec notre équipe pour gérer la relation." : lang === "en" ? "A direct contact with our team to manage the relationship." : "Un contacto directo con nuestro equipo para gestionar la relación." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 bg-[#D4A96A]/10 border border-[#D4A96A]/20 rounded-xl flex items-center justify-center shrink-0">
                    <MIcon name={icon} size={20} fill className="text-[#D4A96A]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-[#D4A96A]/10 border border-[#D4A96A]/20 rounded-2xl">
              <p className="text-[#D4A96A] font-bold text-sm mb-1">{lang === "fr" ? "Contact direct" : lang === "en" ? "Direct contact" : "Contacto directo"}</p>
              <a href="mailto:contact@eson-maroc.com" className="flex items-center gap-2 text-white text-sm hover:text-[#D4A96A] transition-colors">
                <Mail size={14} className="text-[#D4A96A]" />
                contact@eson-maroc.com
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {sent ? (
              <div className="bg-[#0a0a0a] border border-[#D4A96A]/20 rounded-3xl p-10 text-center">
                <div className="w-16 h-16 bg-[#D4A96A]/10 border border-[#D4A96A]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-[#D4A96A]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{become.success}</h3>
                <p className="text-gray-500 text-sm">{become.successSub}</p>
                <button
                  onClick={() => { setSent(false); setForm({ company: "", name: "", email: "", phone: "", activity: "", message: "" }); }}
                  className="mt-6 text-sm text-[#D4A96A] hover:underline"
                >
                  {lang === "fr" ? "Envoyer une autre candidature" : lang === "en" ? "Send another application" : "Enviar otra candidatura"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/8 rounded-3xl p-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">{become.fields.company} *</label>
                    <input required value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder={become.fields.company}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">{become.fields.name} *</label>
                    <input required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={become.fields.name}
                      className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">{become.fields.email} *</label>
                    <input required type="email" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder={become.fields.email}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">{become.fields.phone}</label>
                    <input type="tel" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+212 6 XX XX XX XX"
                      className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">{become.fields.activity} *</label>
                  <select required value={form.activity}
                    onChange={(e) => setForm({ ...form, activity: e.target.value })}
                    className={inputCls} style={{ colorScheme: "dark" }}>
                    <option value="" className="bg-[#1a1a1a]">—</option>
                    {[
                      lang === "fr" ? "Hôtel / Riad" : lang === "en" ? "Hotel / Riad" : "Hotel / Riad",
                      lang === "fr" ? "Tour opérateur" : lang === "en" ? "Tour operator" : "Operador turístico",
                      lang === "fr" ? "Guide touristique" : lang === "en" ? "Tour guide" : "Guía turístico",
                      lang === "fr" ? "Restaurant" : "Restaurant" ,
                      lang === "fr" ? "Activité sportive / aventure" : lang === "en" ? "Sports / adventure activity" : "Actividad deportiva / aventura",
                      lang === "fr" ? "Événement / Rally" : lang === "en" ? "Event / Rally" : "Evento / Rally",
                      lang === "fr" ? "Autre" : lang === "en" ? "Other" : "Otro",
                    ].map((opt) => (
                      <option key={opt} className="bg-[#1a1a1a]">{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">{become.fields.message} *</label>
                  <textarea required value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    placeholder={become.fields.message}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4A96A]/60 transition-colors resize-none placeholder-gray-600"
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full yellow-btn py-3.5 rounded-xl font-bold disabled:opacity-60">
                  {loading ? "..." : become.btn}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── CTA RENTAL ─────────────────────────────────────── */}
      <section className="py-14 bg-[#0a0a0a] border-t border-white/8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm mb-3">
            {lang === "fr" ? "Vous voyagez au Maroc ?" : lang === "en" ? "Traveling to Morocco?" : "¿Viajando a Marruecos?"}
          </p>
          <h3 className="text-2xl font-black text-white mb-5">
            {lang === "fr" ? "Combinez location de voiture + hébergement partenaire" : lang === "en" ? "Combine car rental + partner accommodation" : "Combine alquiler de coche + alojamiento socio"}
          </h3>
          <Link href="/fleet" className="yellow-btn inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold">
            {lang === "fr" ? "Voir nos voitures disponibles" : lang === "en" ? "See our available cars" : "Ver nuestros coches disponibles"}
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
