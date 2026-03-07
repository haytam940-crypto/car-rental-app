"use client";
import { useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CARS, LOCATIONS, calculatePrice, checkAvailability } from "@/lib/data";
import { saveReservation } from "@/lib/store";
import { Fuel, Settings, Users, Calendar, MapPin, ChevronLeft, Star } from "lucide-react";

function CarDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Dates pré-remplies depuis le widget de recherche
  const preFrom = searchParams.get("from") || "";
  const preTo = searchParams.get("to") || "";
  const prePickup = searchParams.get("pickup") || "";
  const preDropoff = searchParams.get("dropoff") || "";

  const car = CARS.find((c) => c.id === id);
  const today = new Date().toISOString().split("T")[0];

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
    // Passer directement à l'étape formulaire si les dates sont déjà remplies
    preFrom && preTo && prePickup && preDropoff ? "form" : "dates"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!car) {
    return (
      <main>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Voiture introuvable</h1>
            <Link href="/fleet" className="text-[#e63946] hover:underline">← Retour a la flotte</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const { durationDays, totalPrice } =
    form.pickupDate && form.dropoffDate
      ? calculatePrice(form.pickupDate, form.dropoffDate, car.pricePerDay)
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
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Email invalide";
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

    // Sauvegarde en localStorage
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

  return (
    <main>
      <Header />

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/fleet" className="inline-flex items-center gap-1 text-gray-500 text-sm hover:text-[#e63946] transition-colors">
            <ChevronLeft size={16} />
            Retour a la flotte
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — Car info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div>
              <div className="rounded-2xl overflow-hidden h-72 md:h-96 bg-gray-100 mb-3">
                <img
                  src={car.images[activeImg]}
                  alt={`${car.brand} ${car.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {car.images.length > 1 && (
                <div className="flex gap-3">
                  {car.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-[#e63946]" : "border-transparent"}`}
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
                <p className="text-gray-400 font-medium text-sm uppercase tracking-wider">{car.brand}</p>
                <h1 className="text-3xl md:text-4xl font-black text-[#1a1a2e]">{car.name}</h1>
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={14} className="fill-[#f4a261] text-[#f4a261]" />
                  ))}
                  <span className="text-gray-400 text-sm ml-1">(4.9 — 48 avis)</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-[#e63946]">{car.pricePerDay} <span className="text-base font-normal text-gray-400">DH</span></div>
                <p className="text-gray-400 text-sm">par jour</p>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Fuel, label: "Carburant", value: car.fuelType },
                { icon: Settings, label: "Boite", value: car.transmission },
                { icon: Users, label: "Places", value: `${car.seats} personnes` },
                { icon: Calendar, label: "Annee", value: car.year },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                  <Icon size={20} className="text-[#e63946] mx-auto mb-2" />
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-bold text-[#1a1a2e] text-sm">{value}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">{car.description}</p>
            </div>

            <div className={`flex items-center gap-3 p-4 rounded-xl ${car.status === "available" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className={`w-3 h-3 rounded-full ${car.status === "available" ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
              <span className={`font-semibold text-sm ${car.status === "available" ? "text-green-700" : "text-red-700"}`}>
                {car.status === "available" ? "Véhicule disponible à la location" : "Véhicule actuellement indisponible"}
              </span>
            </div>
          </div>

          {/* RIGHT — Réservation widget */}
          {car.status === "available" && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-28">
                <h3 className="text-lg font-bold text-[#1a1a2e] mb-1">Réserver ce véhicule</h3>
                <p className="text-gray-400 text-sm mb-6">
                  {step === "form" && preFrom && preTo
                    ? "Vos dates ont été pré-remplies"
                    : "Sélectionnez vos dates et lieux"}
                </p>

                {step === "dates" && (
                  <div className="space-y-4">
                    {errors.general && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">{errors.general}</div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        <MapPin size={11} className="inline mr-1 text-[#e63946]" />Lieu de départ
                      </label>
                      <select
                        value={form.pickupLocation}
                        onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#e63946] transition-colors ${errors.pickupLocation ? "border-red-300" : "border-gray-200"}`}
                      >
                        <option value="">Choisir...</option>
                        {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                      {errors.pickupLocation && <p className="text-red-500 text-xs mt-1">{errors.pickupLocation}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        <MapPin size={11} className="inline mr-1 text-[#e63946]" />Lieu de retour
                      </label>
                      <select
                        value={form.dropoffLocation}
                        onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#e63946] transition-colors ${errors.dropoffLocation ? "border-red-300" : "border-gray-200"}`}
                      >
                        <option value="">Choisir...</option>
                        {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                      {errors.dropoffLocation && <p className="text-red-500 text-xs mt-1">{errors.dropoffLocation}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                          <Calendar size={11} className="inline mr-1 text-[#e63946]" />Départ
                        </label>
                        <input
                          type="date" min={today}
                          value={form.pickupDate}
                          onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
                          className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#e63946] ${errors.pickupDate ? "border-red-300" : "border-gray-200"}`}
                        />
                        {errors.pickupDate && <p className="text-red-500 text-xs mt-1">{errors.pickupDate}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                          <Calendar size={11} className="inline mr-1 text-[#e63946]" />Retour
                        </label>
                        <input
                          type="date" min={form.pickupDate || today}
                          value={form.dropoffDate}
                          onChange={(e) => setForm({ ...form, dropoffDate: e.target.value })}
                          className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#e63946] ${errors.dropoffDate ? "border-red-300" : "border-gray-200"}`}
                        />
                        {errors.dropoffDate && <p className="text-red-500 text-xs mt-1">{errors.dropoffDate}</p>}
                      </div>
                    </div>

                    {durationDays > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500">
                          <span>{car.pricePerDay} DH × {durationDays} jour(s)</span>
                        </div>
                        <div className="flex justify-between font-black text-[#1a1a2e] text-lg border-t pt-2">
                          <span>Total</span>
                          <span className="text-[#e63946]">{totalPrice} DH</span>
                        </div>
                      </div>
                    )}

                    <button onClick={handleNextStep} className="w-full bg-[#e63946] text-white py-3.5 rounded-xl font-bold hover:bg-[#c1121f] transition-colors">
                      Continuer la réservation
                    </button>
                  </div>
                )}

                {step === "form" && (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Summary */}
                    <div className="bg-[#1a1a2e] text-white rounded-xl p-4 text-sm mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">{durationDays} jour(s) · {form.pickupDate} → {form.dropoffDate}</span>
                        <span className="font-bold text-[#e63946]">{totalPrice} DH</span>
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {form.pickupLocation} → {form.dropoffLocation}
                      </div>
                    </div>

                    {/* Bouton modifier les dates */}
                    <button
                      type="button"
                      onClick={() => setStep("dates")}
                      className="w-full text-xs text-gray-400 hover:text-[#e63946] transition-colors text-left mb-1"
                    >
                      Modifier les dates / lieux →
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input placeholder="Prénom *" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#e63946] ${errors.firstName ? "border-red-300" : "border-gray-200"}`} />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <input placeholder="Nom *" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#e63946] ${errors.lastName ? "border-red-300" : "border-gray-200"}`} />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <input type="tel" placeholder="Téléphone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#e63946] ${errors.phone ? "border-red-300" : "border-gray-200"}`} />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <input type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#e63946] ${errors.email ? "border-red-300" : "border-gray-200"}`} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <input placeholder="N° permis de conduire *" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#e63946] ${errors.license ? "border-red-300" : "border-gray-200"}`} />
                      {errors.license && <p className="text-red-500 text-xs mt-1">{errors.license}</p>}
                    </div>

                    <textarea placeholder="Message (optionnel)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#e63946] resize-none" />

                    <button type="submit" disabled={submitting}
                      className="w-full bg-[#e63946] text-white py-3.5 rounded-xl font-bold hover:bg-[#c1121f] transition-colors disabled:opacity-60">
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <CarDetailContent />
    </Suspense>
  );
}
