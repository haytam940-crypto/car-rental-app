"use client";
import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CARS, LOCATIONS, calculatePrice, checkAvailability } from "@/lib/data";
import { saveReservation, getStoredCars } from "@/lib/store";
import { Fuel, Settings, Users, Calendar, MapPin, ChevronLeft, Star, Shield, Check } from "lucide-react";

function CarDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const preFrom = searchParams.get("from") || "";
  const preTo = searchParams.get("to") || "";
  const prePickup = searchParams.get("pickup") || "";
  const preDropoff = searchParams.get("dropoff") || "";

  const [storedCars, setStoredCars] = useState(CARS);
  useEffect(() => { setStoredCars(getStoredCars()); }, []);
  const car = storedCars.find((c) => c.id === id);
  const today = new Date().toISOString().split("T")[0];
  const effectivePrice = car
    ? (car.discount && car.discount > 0 ? Math.round(car.pricePerDay * (1 - car.discount / 100)) : car.pricePerDay)
    : 0;

  const [activeImg, setActiveImg] = useState(0);
  const [form, setForm] = useState({
    pickupLocation: prePickup,
    dropoffLocation: preDropoff,
    pickupDate: preFrom,
    dropoffDate: preTo,
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    license: "",
    message: "",
  });
  const [step, setStep] = useState<"dates" | "form">(
    preFrom && preTo && prePickup && preDropoff ? "form" : "dates"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!car) {
    return (
      <main className="bg-[#0a0a0a] min-h-screen">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Voiture introuvable</h1>
            <Link href="/fleet" className="text-[#F5C518] hover:underline">← Retour à la flotte</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const { durationDays, totalPrice } =
    form.pickupDate && form.dropoffDate
      ? calculatePrice(form.pickupDate, form.dropoffDate, effectivePrice)
      : { durationDays: 0, totalPrice: 0 };

  const isAvailable =
    form.pickupDate && form.dropoffDate
      ? checkAvailability(car.id, form.pickupDate, form.dropoffDate)
      : true;

  const validateDates = () => {
    const e: Record<string, string> = {};
    if (!form.pickupLocation) e.pickupLocation = "Lieu de départ requis";
    if (!form.dropoffLocation) e.dropoffLocation = "Lieu de retour requis";
    if (!form.pickupDate) e.pickupDate = "Date de départ requise";
    if (!form.dropoffDate) e.dropoffDate = "Date de retour requise";
    if (form.dropoffDate && form.pickupDate && form.dropoffDate <= form.pickupDate)
      e.dropoffDate = "La date de retour doit être après la date de départ";
    if (!isAvailable) e.general = "Cette voiture est déjà réservée sur ces dates";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Prénom requis";
    if (!form.lastName.trim()) e.lastName = "Nom requis";
    if (!form.phone.trim()) e.phone = "Téléphone requis";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email))
      e.email = "Adresse email invalide (ex: nom@domaine.com)";
    if (!form.license.trim()) e.license = "Numéro de permis requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNextStep = () => {
    if (validateDates()) setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    await new Promise((r) => setTimeout(r, 800));

    const reservationId = `RES-${Date.now()}`;

    saveReservation({
      id: reservationId,
      carId: car.id,
      clientFirstName: form.firstName,
      clientLastName: form.lastName,
      clientPhone: form.phone,
      clientEmail: form.email,
      clientLicense: form.license,
      pickupLocation: form.pickupLocation,
      dropoffLocation: form.dropoffLocation,
      pickupDate: form.pickupDate,
      dropoffDate: form.dropoffDate,
      durationDays,
      totalPrice,
      status: "pending",
      message: form.message,
      createdAt: new Date().toISOString().split("T")[0],
    });

    router.push(
      `/booking?id=${reservationId}&car=${encodeURIComponent(`${car.brand} ${car.name}`)}&total=${totalPrice}&days=${durationDays}&pickup=${encodeURIComponent(form.pickupDate)}&dropoff=${encodeURIComponent(form.dropoffDate)}`
    );
  };

  const inputCls = (hasError?: string) =>
    `w-full bg-[#1a1a1a] border rounded-xl px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder-gray-600 ${
      hasError ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-[#F5C518]/60"
    }`;

  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/fleet" className="inline-flex items-center gap-1 text-gray-500 text-sm hover:text-[#F5C518] transition-colors">
            <ChevronLeft size={16} />
            Retour à la flotte
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — Car info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div>
              <div className="rounded-2xl overflow-hidden h-72 md:h-96 bg-[#111111] border border-white/8">
                <img
                  src={car.images[activeImg]}
                  alt={`${car.brand} ${car.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {car.images.length > 1 && (
                <div className="flex gap-3 mt-3">
                  {car.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImg === i ? "border-[#F5C518]" : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Price */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-[#F5C518] font-semibold text-xs uppercase tracking-widest mb-1">{car.brand}</p>
                <h1 className="text-3xl md:text-4xl font-black text-white">{car.name}
                  <span className="text-lg font-normal text-gray-500 ml-3">{car.year}</span>
                </h1>
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={14} className="fill-[#F5C518] text-[#F5C518]" />
                  ))}
                  <span className="text-gray-500 text-sm ml-1">(4.9 — 48 avis)</span>
                </div>
              </div>
              <div className="text-right">
                {car.discount && car.discount > 0 ? (
                  <>
                    <div className="text-sm line-through text-gray-500">{car.pricePerDay} DH/jour</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-[#F5C518]">{effectivePrice}</span>
                      <span className="text-base text-gray-400">DH/jour</span>
                    </div>
                    <span className="inline-block bg-[#F5C518] text-black text-xs font-black px-2 py-0.5 rounded-md mt-1">
                      -{car.discount}% de réduction
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-[#F5C518]">{car.pricePerDay}</span>
                      <span className="text-base text-gray-400">DH/jour</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Fuel, label: "Carburant", value: car.fuelType },
                { icon: Settings, label: "Boîte", value: car.transmission },
                { icon: Users, label: "Places", value: `${car.seats} personnes` },
                { icon: Calendar, label: "Année", value: car.year },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-[#111111] border border-white/8 rounded-xl p-4 text-center hover:border-[#F5C518]/30 transition-colors">
                  <Icon size={20} className="text-[#F5C518] mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className="font-bold text-white text-sm">{value}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-3">Description</h2>
              <p className="text-gray-400 leading-relaxed">{car.description}</p>
            </div>

            {/* Included */}
            <div className="bg-[#111111] border border-white/8 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-[#F5C518]" />
                <h3 className="font-bold text-white text-sm">Inclus dans le prix</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["Assurance tous risques", "Kilométrage illimité", "Assistance 24h/24", "Livraison à domicile"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-400">
                    <Check size={14} className="text-[#F5C518] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className={`flex items-center gap-3 p-4 rounded-xl border ${
              car.status === "available"
                ? "bg-green-500/10 border-green-500/20"
                : "bg-red-500/10 border-red-500/20"
            }`}>
              <div className={`w-3 h-3 rounded-full ${car.status === "available" ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
              <span className={`font-semibold text-sm ${car.status === "available" ? "text-green-400" : "text-red-400"}`}>
                {car.status === "available" ? "Véhicule disponible à la location" : "Véhicule actuellement indisponible"}
              </span>
            </div>
          </div>

          {/* RIGHT — Réservation widget */}
          {car.status === "available" && (
            <div className="lg:col-span-1">
              <div className="bg-[#111111] border border-white/8 rounded-2xl p-6 sticky top-28">
                <h3 className="text-lg font-bold text-white mb-1">Réserver ce véhicule</h3>
                <p className="text-gray-500 text-sm mb-6">
                  {step === "form" && preFrom && preTo
                    ? "Vos dates ont été pré-remplies"
                    : "Sélectionnez vos dates et lieux"}
                </p>

                {step === "dates" && (
                  <div className="space-y-4">
                    {errors.general && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">{errors.general}</div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold text-[#F5C518] uppercase tracking-widest mb-1.5">
                        <MapPin size={10} className="inline mr-1" />Lieu de départ
                      </label>
                      <select
                        value={form.pickupLocation}
                        onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                        className={inputCls(errors.pickupLocation)}
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="" className="bg-[#1a1a1a]">Choisir...</option>
                        {LOCATIONS.map((l) => <option key={l} value={l} className="bg-[#1a1a1a]">{l}</option>)}
                      </select>
                      {errors.pickupLocation && <p className="text-red-400 text-xs mt-1">{errors.pickupLocation}</p>}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#F5C518] uppercase tracking-widest mb-1.5">
                        <MapPin size={10} className="inline mr-1" />Lieu de retour
                      </label>
                      <select
                        value={form.dropoffLocation}
                        onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })}
                        className={inputCls(errors.dropoffLocation)}
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="" className="bg-[#1a1a1a]">Choisir...</option>
                        {LOCATIONS.map((l) => <option key={l} value={l} className="bg-[#1a1a1a]">{l}</option>)}
                      </select>
                      {errors.dropoffLocation && <p className="text-red-400 text-xs mt-1">{errors.dropoffLocation}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#F5C518] uppercase tracking-widest mb-1.5">
                          <Calendar size={10} className="inline mr-1" />Départ
                        </label>
                        <input
                          type="date" min={today}
                          value={form.pickupDate}
                          onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
                          className={inputCls(errors.pickupDate)}
                          style={{ colorScheme: "dark" }}
                        />
                        {errors.pickupDate && <p className="text-red-400 text-xs mt-1">{errors.pickupDate}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#F5C518] uppercase tracking-widest mb-1.5">
                          <Calendar size={10} className="inline mr-1" />Retour
                        </label>
                        <input
                          type="date" min={form.pickupDate || today}
                          value={form.dropoffDate}
                          onChange={(e) => setForm({ ...form, dropoffDate: e.target.value })}
                          className={inputCls(errors.dropoffDate)}
                          style={{ colorScheme: "dark" }}
                        />
                        {errors.dropoffDate && <p className="text-red-400 text-xs mt-1">{errors.dropoffDate}</p>}
                      </div>
                    </div>

                    {durationDays > 0 && (
                      <div className="bg-[#0a0a0a] border border-white/8 rounded-xl p-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500">
                          <span>
                            {effectivePrice} DH × {durationDays} jour(s)
                            {car.discount && car.discount > 0 && (
                              <span className="ml-1 text-[#F5C518] font-semibold">(-{car.discount}%)</span>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between font-black text-white text-lg border-t border-white/8 pt-2">
                          <span>Total</span>
                          <span className="text-[#F5C518]">{totalPrice} DH</span>
                        </div>
                      </div>
                    )}

                    <button onClick={handleNextStep} className="w-full yellow-btn py-3.5 rounded-xl font-bold">
                      Continuer la réservation
                    </button>
                  </div>
                )}

                {step === "form" && (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Summary */}
                    <div className="bg-[#0a0a0a] border border-[#F5C518]/20 rounded-xl p-4 text-sm mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">{durationDays} jour(s) · {form.pickupDate} → {form.dropoffDate}</span>
                        <span className="font-bold text-[#F5C518]">{totalPrice} DH</span>
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {form.pickupLocation} → {form.dropoffLocation}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep("dates")}
                      className="w-full text-xs text-gray-500 hover:text-[#F5C518] transition-colors text-left mb-1"
                    >
                      Modifier les dates / lieux →
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input placeholder="Prénom *" value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          className={inputCls(errors.firstName)} />
                        {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <input placeholder="Nom *" value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          className={inputCls(errors.lastName)} />
                        {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <input type="tel" placeholder="Téléphone *" value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={inputCls(errors.phone)} />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <input type="email" placeholder="Email *" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputCls(errors.email)} />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <input placeholder="N° permis de conduire *" value={form.license}
                        onChange={(e) => setForm({ ...form, license: e.target.value })}
                        className={inputCls(errors.license)} />
                      {errors.license && <p className="text-red-400 text-xs mt-1">{errors.license}</p>}
                    </div>

                    <textarea placeholder="Message (optionnel)" value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={2}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#F5C518]/60 transition-colors resize-none placeholder-gray-600" />

                    <button type="submit" disabled={submitting}
                      className="w-full yellow-btn py-3.5 rounded-xl font-bold disabled:opacity-60">
                      {submitting ? "Envoi en cours..." : "Confirmer la réservation"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function CarDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Chargement...</div>}>
      <CarDetailContent />
    </Suspense>
  );
}
