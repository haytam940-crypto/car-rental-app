"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MIcon from "@/components/MIcon";

const OFFICES = [
  { city: "Casablanca", address: "123 Boulevard Mohammed V", phone: "+212 5 22 00 00 00", hours: "Lun–Sam 8h–20h" },
  { city: "Marrakech", address: "45 Avenue Mohammed VI, Gueliz", phone: "+212 5 24 00 00 00", hours: "Lun–Sam 8h–20h" },
  { city: "Agadir", address: "12 Rue du 18 Novembre", phone: "+212 5 28 00 00 00", hours: "Lun–Sam 8h–20h" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  const inputCls = "w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#F5C518]/60 transition-colors placeholder-gray-600";

  return (
    <main className="bg-[#0a0a0a]">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-14 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 to-[#0a0a0a]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#F5C518] text-xs font-bold uppercase tracking-widest mb-3">Nous contacter</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">On est là pour vous</h1>
          <p className="text-gray-400">Disponible 7j/7 de 8h à 22h pour répondre à toutes vos demandes.</p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="bg-[#111111] border-y border-white/8">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: "phone", label: "Téléphone", value: "+212 6 00 00 00 00", href: "tel:+212600000000" },
            { icon: "mail", label: "Email", value: "contact@autoloc.ma", href: "mailto:contact@autoloc.ma" },
            { icon: "schedule", label: "Horaires", value: "7j/7 · 8h00 – 22h00", href: null },
          ].map(({ icon, label, value, href }) => (
            <div key={label} className="flex items-center gap-4 p-5 rounded-2xl border border-white/8 hover:border-[#F5C518]/30 transition-all group">
              <div className="w-12 h-12 bg-[#F5C518]/10 border border-[#F5C518]/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#F5C518] transition-colors">
                <MIcon name={icon} size={22} fill className="text-[#F5C518] group-hover:text-black transition-colors" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
                {href ? (
                  <a href={href} className="font-semibold text-white hover:text-[#F5C518] transition-colors text-sm">{value}</a>
                ) : (
                  <p className="font-semibold text-white text-sm">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Offices */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-black text-white mb-6">Envoyer un message</h2>

            {sent ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-10 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MIcon name="check_circle" size={32} fill className="text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-green-400 mb-2">Message envoyé !</h3>
                <p className="text-green-500/80 text-sm">Notre équipe vous répondra sous 2 heures.</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                  className="mt-6 text-sm text-[#F5C518] hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/8 rounded-2xl p-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#F5C518] uppercase tracking-widest mb-1.5">Nom complet *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Votre nom" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#F5C518] uppercase tracking-widest mb-1.5">Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="votre@email.com" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#F5C518] uppercase tracking-widest mb-1.5">Téléphone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+212 6 XX XX XX XX" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#F5C518] uppercase tracking-widest mb-1.5">Sujet *</label>
                    <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={inputCls} style={{ colorScheme: "dark" }}>
                      <option value="" className="bg-[#1a1a1a]">Choisir...</option>
                      <option className="bg-[#1a1a1a]">Demande de réservation</option>
                      <option className="bg-[#1a1a1a]">Question tarifs</option>
                      <option className="bg-[#1a1a1a]">Modification réservation</option>
                      <option className="bg-[#1a1a1a]">Réclamation</option>
                      <option className="bg-[#1a1a1a]">Autre</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#F5C518] uppercase tracking-widest mb-1.5">Message *</label>
                  <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5} placeholder="Décrivez votre demande..."
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#F5C518]/60 transition-colors resize-none placeholder-gray-600" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full yellow-btn py-3.5 rounded-xl font-bold disabled:opacity-60">
                  {loading ? "Envoi en cours..." : "Envoyer le message"}
                </button>
              </form>
            )}
          </div>

          {/* Offices */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black text-white mb-6">Nos agences</h2>
            <div className="space-y-4">
              {OFFICES.map(({ city, address, phone, hours }) => (
                <div key={city} className="bg-[#111111] border border-white/8 rounded-2xl p-5 hover:border-[#F5C518]/20 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[#F5C518] rounded-lg flex items-center justify-center">
                      <MIcon name="location_on" size={16} fill className="text-black" />
                    </div>
                    <h3 className="font-bold text-white">{city}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{address}</p>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-sm text-[#F5C518] font-medium hover:underline block mb-1">{phone}</a>
                  <p className="text-xs text-gray-600">{hours}</p>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/212600000000"
              className="mt-4 flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 px-5 py-4 rounded-2xl font-semibold hover:bg-green-500/20 transition-colors w-full justify-center"
            >
              <MIcon name="chat" size={20} fill />
              Contacter sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
