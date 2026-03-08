"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Excursion } from "@/lib/data";
import { saveExcursionBooking, getMergedExcursions, getActivePromotion } from "@/lib/store";
import { MapPin, Clock, Users, Check, ChevronRight, X, Star, Mountain } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CATEGORIES = ["Tous", "Désert", "Montagne", "Côte", "Ville", "Circuit"] as const;

const difficultyStyle: Record<string, string> = {
  Facile: "bg-green-500/15 text-green-400 border border-green-500/20",
  Modéré: "bg-[#D4A96A]/15 text-[#D4A96A] border border-[#D4A96A]/20",
  Difficile: "bg-red-500/15 text-red-400 border border-red-500/20",
};

const categoryIcons: Record<string, string> = {
  Désert: "🏜️", Montagne: "🏔️", Côte: "🌊", Ville: "🕌", Circuit: "🗺️",
};

const TODAY = new Date().toISOString().split("T")[0];

const EMPTY_FORM = {
  clientFirstName: "", clientLastName: "", clientPhone: "",
  clientEmail: "", participants: 1, date: TODAY, message: "",
};

function ExcursionsContent() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") || "Tous";
  const [activeCategory, setActiveCategory] = useState<string>(urlCategory);
  const [selected, setSelected] = useState<Excursion | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  useEffect(() => {
    const promo = getActivePromotion();
    if (promo && (promo.applyTo === "excursions" || promo.applyTo === "all")) {
      setPromoDiscount(promo.discountPercent);
    }
  }, []);

  const excPrice = (base: number) => {
    const ht = promoDiscount > 0 ? Math.round(base * (1 - promoDiscount / 100)) : base;
    const ttc = Math.round(ht * 1.2);
    return { ht, ttc, hasPromo: promoDiscount > 0 };
  };

  const allExcursions = getMergedExcursions();
  const filtered = activeCategory === "Tous"
    ? allExcursions
    : allExcursions.filter((e) => e.category === activeCategory);

  const TEXTS: Record<string, Record<string, string>> = {
    fr: {
      tag: "DÉCOUVREZ LE MAROC",
      heroTitle: "Excursions & Circuits",
      heroSub: "Des aventures inoubliables au cœur du Maroc. Désert, montagne, médinas — vivez le Maroc authentique.",
      book: "Réserver cette excursion",
      perPerson: "/personne",
      maxPart: "personnes max",
      duration: "Durée",
      included: "Inclus dans le pack",
      formTitle: "Réserver votre place",
      firstName: "Prénom *", lastName: "Nom *", phone: "Téléphone *",
      email: "Email", participants: "Nombre de participants *",
      date: "Date souhaitée *", message: "Message (optionnel)",
      confirm: "Confirmer la réservation",
      cancel: "Annuler",
      errName: "Veuillez renseigner prénom et nom.",
      errPhone: "Veuillez renseigner un numéro de téléphone.",
      errDate: "Veuillez choisir une date.",
      errPart: "Au moins 1 participant requis.",
      successTitle: "Réservation envoyée !",
      successSub: "Nous vous contacterons sous 24h pour confirmer votre excursion.",
      successBtn: "Voir d'autres excursions",
      total: "Total estimé",
      for: "pour",
      persons: "pers.",
      difficulty: "Difficulté",
      destination: "Destination",
    },
    en: {
      tag: "DISCOVER MOROCCO",
      heroTitle: "Excursions & Tours",
      heroSub: "Unforgettable adventures in the heart of Morocco. Desert, mountains, medinas — experience authentic Morocco.",
      book: "Book this excursion",
      perPerson: "/person",
      maxPart: "max participants",
      duration: "Duration",
      included: "Included in the package",
      formTitle: "Book your spot",
      firstName: "First name *", lastName: "Last name *", phone: "Phone *",
      email: "Email", participants: "Number of participants *",
      date: "Preferred date *", message: "Message (optional)",
      confirm: "Confirm booking",
      cancel: "Cancel",
      errName: "Please enter first and last name.",
      errPhone: "Please enter a phone number.",
      errDate: "Please choose a date.",
      errPart: "At least 1 participant required.",
      successTitle: "Booking sent!",
      successSub: "We will contact you within 24h to confirm your excursion.",
      successBtn: "See other excursions",
      total: "Estimated total",
      for: "for",
      persons: "pers.",
      difficulty: "Difficulty",
      destination: "Destination",
    },
    es: {
      tag: "DESCUBRE MARRUECOS",
      heroTitle: "Excursiones y Circuitos",
      heroSub: "Aventuras inolvidables en el corazón de Marruecos. Desierto, montañas, medinas — vive el Marruecos auténtico.",
      book: "Reservar esta excursión",
      perPerson: "/persona",
      maxPart: "participantes máx",
      duration: "Duración",
      included: "Incluido en el paquete",
      formTitle: "Reserva tu plaza",
      firstName: "Nombre *", lastName: "Apellido *", phone: "Teléfono *",
      email: "Email", participants: "Número de participantes *",
      date: "Fecha deseada *", message: "Mensaje (opcional)",
      confirm: "Confirmar reserva",
      cancel: "Cancelar",
      errName: "Por favor ingrese nombre y apellido.",
      errPhone: "Por favor ingrese un número de teléfono.",
      errDate: "Por favor elija una fecha.",
      errPart: "Se requiere al menos 1 participante.",
      successTitle: "¡Reserva enviada!",
      successSub: "Le contactaremos en 24h para confirmar su excursión.",
      successBtn: "Ver otras excursiones",
      total: "Total estimado",
      for: "para",
      persons: "pers.",
      difficulty: "Dificultad",
      destination: "Destino",
    },
  };
  const T = TEXTS[lang] ?? TEXTS.fr;

  const totalPrice = selected ? excPrice(selected.pricePerPerson).ht * form.participants : 0;

  const handleBook = () => {
    setFormError("");
    if (!form.clientFirstName || !form.clientLastName) return setFormError(T.errName);
    if (!form.clientPhone) return setFormError(T.errPhone);
    if (!form.date) return setFormError(T.errDate);
    if (form.participants < 1) return setFormError(T.errPart);
    if (!selected) return;

    saveExcursionBooking({
      id: `excb-${Date.now()}`,
      excursionId: selected.id,
      clientFirstName: form.clientFirstName,
      clientLastName: form.clientLastName,
      clientPhone: form.clientPhone,
      clientEmail: form.clientEmail,
      participants: form.participants,
      date: form.date,
      totalPrice,
      status: "pending",
      message: form.message || undefined,
      createdAt: TODAY,
    });
    setSuccess(true);
  };

  const inp = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4A96A]/60 transition-colors placeholder-gray-600";

  return (
    <main className="bg-[#0a0a0a]">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-transparent to-[#0a0a0a]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4A96A]/10 border border-[#D4A96A]/30 text-[#D4A96A] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Mountain size={13} />
            {T.tag}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">{T.heroTitle}</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">{T.heroSub}</p>
        </div>
      </section>

      {/* Stats band */}
      <div className="bg-[#111111] border-y border-white/8">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-3 gap-6 text-center">
          {[
            { value: `${allExcursions.length}`, label: "Excursions" },
            { value: "100%", label: "Guides certifiés" },
            { value: "4.9★", label: "Note moyenne" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-black text-[#D4A96A]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-4">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                activeCategory === cat
                  ? "bg-[#D4A96A] text-black border-[#D4A96A]"
                  : "bg-[#111] text-gray-400 border-white/8 hover:border-[#D4A96A]/40 hover:text-white"
              }`}
            >
              {cat !== "Tous" && <span className="mr-1.5">{categoryIcons[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((excursion) => (
          <div key={excursion.id} className="group bg-[#111111] border border-white/8 rounded-2xl overflow-hidden hover:border-[#D4A96A]/30 transition-all hover:-translate-y-1 duration-300 flex flex-col">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={excursion.image}
                alt={excursion.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${difficultyStyle[excursion.difficulty]}`}>
                  {excursion.difficulty}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-1.5">
                {excPrice(excursion.pricePerPerson).hasPromo && (
                  <div className="text-gray-400 line-through text-xs">{excursion.pricePerPerson} DH HT</div>
                )}
                <span className="text-[#D4A96A] font-black text-lg">{excPrice(excursion.pricePerPerson).ht}</span>
                <span className="text-white/60 text-xs"> DH HT{T.perPerson}</span>
                <div className="text-gray-500 text-[10px]">{excPrice(excursion.pricePerPerson).ttc} DH TTC</div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-white text-base leading-tight">{excursion.title}</h3>
                <span className="text-lg shrink-0">{categoryIcons[excursion.category]}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1"><MapPin size={11} className="text-[#D4A96A]" />{excursion.destination}</span>
                <span className="flex items-center gap-1"><Clock size={11} className="text-[#D4A96A]" />{excursion.duration}</span>
                <span className="flex items-center gap-1"><Users size={11} className="text-[#D4A96A]" />{excursion.maxParticipants} max</span>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{excursion.description}</p>

              <div className="mt-auto space-y-1.5 mb-4">
                {excursion.includes.slice(0, 3).map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-gray-400">
                    <Check size={11} className="text-[#D4A96A] shrink-0" />
                    {item}
                  </div>
                ))}
                {excursion.includes.length > 3 && (
                  <p className="text-xs text-[#D4A96A]/70">+{excursion.includes.length - 3} autres inclus</p>
                )}
              </div>

              <button
                onClick={() => { setSelected(excursion); setForm(EMPTY_FORM); setSuccess(false); setFormError(""); }}
                className="w-full flex items-center justify-center gap-2 bg-[#D4A96A] hover:bg-[#b8894e] text-black text-sm font-bold py-2.5 rounded-xl transition-colors"
              >
                {T.book} <ChevronRight size={15} />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-[#D4A96A]/10 to-transparent border border-[#D4A96A]/20 rounded-3xl p-10">
          <Star size={32} className="text-[#D4A96A] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-3">Une excursion sur mesure ?</h2>
          <p className="text-gray-400 mb-6">Contactez-nous pour créer un circuit personnalisé selon vos envies et votre budget.</p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-[#D4A96A] hover:bg-[#b8894e] text-black font-bold px-7 py-3 rounded-xl transition-colors">
            Nous contacter <ChevronRight size={16} />
          </a>
        </div>
      </section>

      <Footer />

      {/* Booking modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center px-4 py-6">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-[#111111] border-b border-white/8 px-6 py-4 flex items-start justify-between gap-3 z-10">
              <div>
                <p className="text-[10px] text-[#D4A96A] font-bold uppercase tracking-widest mb-0.5">{T.book}</p>
                <h2 className="font-bold text-white text-base leading-tight">{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white mt-0.5 shrink-0">
                <X size={20} />
              </button>
            </div>

            {success ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-green-500/15 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{T.successTitle}</h3>
                <p className="text-gray-400 text-sm mb-6">{T.successSub}</p>
                <button
                  onClick={() => { setSelected(null); setSuccess(false); }}
                  className="px-6 py-2.5 bg-[#D4A96A] text-black font-bold rounded-xl hover:bg-[#b8894e] transition-colors text-sm"
                >
                  {T.successBtn}
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                {/* Excursion recap */}
                <div className="bg-[#1a1a1a] border border-white/8 rounded-xl p-4 flex gap-4">
                  <img src={selected.image} alt={selected.title} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Clock size={11} className="text-[#D4A96A]" />{selected.duration}
                      <MapPin size={11} className="text-[#D4A96A] ml-1" />{selected.destination}
                    </div>
                    <p className="text-[#D4A96A] font-black text-lg">
                      {excPrice(selected.pricePerPerson).ht} DH HT
                      <span className="text-gray-500 text-xs font-normal">{T.perPerson}</span>
                    </p>
                    <p className="text-gray-600 text-xs">{excPrice(selected.pricePerPerson).ttc} DH TTC</p>
                  </div>
                </div>

                {/* Form */}
                <div>
                  <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Informations client</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{T.firstName}</label>
                      <input className={inp} value={form.clientFirstName} onChange={(e) => setForm({ ...form, clientFirstName: e.target.value })} placeholder="Prénom" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{T.lastName}</label>
                      <input className={inp} value={form.clientLastName} onChange={(e) => setForm({ ...form, clientLastName: e.target.value })} placeholder="Nom" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{T.phone}</label>
                      <input className={inp} value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} placeholder="+212 6 XX XX XX XX" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{T.email}</label>
                      <input className={inp} type="email" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} placeholder="email@exemple.com" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-3">Détails de l'excursion</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{T.date}</label>
                      <input className={inp} type="date" min={TODAY} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={{ colorScheme: "dark" }} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">{T.participants}</label>
                      <input className={inp} type="number" min={1} max={selected.maxParticipants} value={form.participants} onChange={(e) => setForm({ ...form, participants: parseInt(e.target.value) || 1 })} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5">Maximum {selected.maxParticipants} {T.maxPart}</p>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">{T.message}</label>
                  <textarea className={inp + " resize-none"} rows={2} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Demandes spéciales, questions..." />
                </div>

                {/* Total */}
                <div className="bg-[#D4A96A]/10 border border-[#D4A96A]/20 rounded-xl px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-gray-400">{T.total} ({T.for} {form.participants} {T.persons})</span>
                  <span className="text-[#D4A96A] font-black text-xl">{totalPrice} DH</span>
                </div>

                {formError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{formError}</div>
                )}

                <div className="flex gap-3 pt-1">
                  <button onClick={() => setSelected(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-gray-400 hover:bg-white/5 transition-colors">
                    {T.cancel}
                  </button>
                  <button onClick={handleBook} className="flex-1 py-2.5 rounded-xl bg-[#D4A96A] text-black text-sm font-bold hover:bg-[#b8894e] transition-colors">
                    {T.confirm}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function ExcursionsPage() {
  return (
    <Suspense fallback={null}>
      <ExcursionsContent />
    </Suspense>
  );
}
