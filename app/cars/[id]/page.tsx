"use client";
import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CARS, LOCATIONS, calculatePrice, checkAvailability } from "@/lib/data";
import { saveReservation, getStoredCars, getDeliveryFees } from "@/lib/store";
import { Fuel, Settings, Users, Calendar, MapPin, ChevronLeft, Star, Shield, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function CarDetailContent() {
  const { id } = useParams();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const preFrom = searchParams.get("from") || "";
  const preTo = searchParams.get("to") || "";
  const prePickup = searchParams.get("pickup") || "";
  const preDropoff = searchParams.get("dropoff") || "";

  const [storedCars, setStoredCars] = useState(CARS);
  const [feeGrid, setFeeGrid] = useState<ReturnType<typeof getDeliveryFees>>([]);
  useEffect(() => {
    setStoredCars(getStoredCars());
    setFeeGrid(getDeliveryFees());
  }, []);
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
    pickupTime: "",
    dropoffTime: "",
    deliveryFee: 0,
    recoveryFee: 0,
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    license: "",
    message: "",
  });
  // Auto-apply delivery fees from grid when location changes
  useEffect(() => {
    if (!form.pickupLocation || feeGrid.length === 0) return;
    const entry = feeGrid.find((f) => f.location === form.pickupLocation);
    if (entry) setForm((prev) => ({ ...prev, deliveryFee: entry.deliveryFee }));
  }, [form.pickupLocation, feeGrid]);

  useEffect(() => {
    if (!form.dropoffLocation || feeGrid.length === 0) return;
    const entry = feeGrid.find((f) => f.location === form.dropoffLocation);
    if (entry) setForm((prev) => ({ ...prev, recoveryFee: entry.recoveryFee }));
  }, [form.dropoffLocation, feeGrid]);

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
            <Link href="/fleet" className="text-[#D4A96A] hover:underline">← Retour à la flotte</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const { durationDays, totalPrice: locationPrice } =
    form.pickupDate && form.dropoffDate
      ? calculatePrice(form.pickupDate, form.dropoffDate, effectivePrice)
      : { durationDays: 0, totalPrice: 0 };
  const totalHT = locationPrice + (form.deliveryFee || 0) + (form.recoveryFee || 0);

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

    const reservationId = `RES-${Date.now()}`;

    const reservationData = {
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
      pickupTime: form.pickupTime,
      dropoffTime: form.dropoffTime,
      durationDays,
      totalPrice: totalHT,
      deliveryFee: form.deliveryFee,
      recoveryFee: form.recoveryFee,
      status: "pending" as const,
      message: form.message,
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Sauvegarde locale (admin dashboard)
    saveReservation(reservationData);

    // Sauvegarde serveur + envoi emails (non bloquant)
    fetch("/api/reservations/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservationData),
    }).catch(err => console.warn("[notify] email non envoyé:", err));

    router.push(
      `/booking?id=${reservationId}&car=${encodeURIComponent(`${car.brand} ${car.name}`)}&total=${totalHT}&days=${durationDays}&pickup=${encodeURIComponent(form.pickupDate)}&dropoff=${encodeURIComponent(form.dropoffDate)}`
    );
  };

  const inputCls = (hasError?: string) =>
    `w-full bg-[#1a1a1a] border rounded-xl px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder-gray-600 ${
      hasError ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-[#D4A96A]/60"
    }`;

  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/fleet" className="inline-flex items-center gap-1 text-gray-500 text-sm hover:text-[#D4A96A] transition-colors">
            <ChevronLeft size={16} />
            {t("car.detail.backToFleet")}
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
                        activeImg === i ? "border-[#D4A96A]" : "border-white/10 hover:border-white/30"
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
                <p className="text-[#D4A96A] font-semibold text-xs uppercase tracking-widest mb-1">{car.brand}</p>
                <h1 className="text-3xl md:text-4xl font-black text-white">{car.name}
                  <span className="text-lg font-normal text-gray-500 ml-3">{car.year}</span>
                </h1>
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={14} className="fill-[#D4A96A] text-[#D4A96A]" />
                  ))}
                  <span className="text-gray-500 text-sm ml-1">(4.9 — 48 avis)</span>
                </div>
              </div>
              <div className="text-right">
                {car.discount && car.discount > 0 ? (
                  <>
                    <div className="text-sm line-through text-gray-500">{car.pricePerDay} DH/jour</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-[#D4A96A]">{effectivePrice}</span>
                      <span className="text-base text-gray-400">DH/jour</span>
                    </div>
                    <span className="inline-block bg-[#D4A96A] text-black text-xs font-black px-2 py-0.5 rounded-md mt-1">
                      -{car.discount}% de réduction
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-[#D4A96A]">{car.pricePerDay}</span>
                      <span className="text-base text-gray-400">DH/jour</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Fuel, label: t("car.detail.fuel"), value: car.fuelType },
                { icon: Settings, label: t("car.detail.transmission"), value: car.transmission },
                { icon: Users, label: t("car.detail.seats"), value: `${car.seats} ${t("car.detail.seats")}` },
                { icon: Calendar, label: t("car.detail.year"), value: car.year },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-[#111111] border border-white/8 rounded-xl p-4 text-center hover:border-[#D4A96A]/30 transition-colors">
                  <Icon size={20} className="text-[#D4A96A] mx-auto mb-2" />
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
                <Shield size={18} className="text-[#D4A96A]" />
                <h3 className="font-bold text-white text-sm">{t("car.detail.included")}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[t("car.detail.insurance"), t("car.detail.unlimited"), t("car.detail.assistance"), t("home.whyUs.delivery")].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-400">
                    <Check size={14} className="text-[#D4A96A] shrink-0" />
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
                <h3 className="text-lg font-bold text-white mb-1">{t("car.detail.book")}</h3>
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
                      <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">
                        <MapPin size={10} className="inline mr-1" />{t("car.detail.pickup")}
                      </label>
                      <select
                        value={form.pickupLocation}
                        onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                        className={inputCls(errors.pickupLocation)}
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="" className="bg-[#1a1a1a]">{t("car.detail.chooseLoc")}</option>
                        {LOCATIONS.map((l) => <option key={l} value={l} className="bg-[#1a1a1a]">{l}</option>)}
                      </select>
                      {errors.pickupLocation && <p className="text-red-400 text-xs mt-1">{errors.pickupLocation}</p>}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">
                        <MapPin size={10} className="inline mr-1" />{t("car.detail.dropoff")}
                      </label>
                      <select
                        value={form.dropoffLocation}
                        onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })}
                        className={inputCls(errors.dropoffLocation)}
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="" className="bg-[#1a1a1a]">{t("car.detail.chooseLoc")}</option>
                        {LOCATIONS.map((l) => <option key={l} value={l} className="bg-[#1a1a1a]">{l}</option>)}
                      </select>
                      {errors.dropoffLocation && <p className="text-red-400 text-xs mt-1">{errors.dropoffLocation}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">
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
                        <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">
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

                    {/* Hours */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">Heure départ</label>
                        <input type="time" value={form.pickupTime}
                          onChange={(e) => setForm({ ...form, pickupTime: e.target.value })}
                          className={inputCls()} style={{ colorScheme: "dark" }} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#D4A96A] uppercase tracking-widest mb-1.5">Heure retour</label>
                        <input type="time" value={form.dropoffTime}
                          onChange={(e) => setForm({ ...form, dropoffTime: e.target.value })}
                          className={inputCls()} style={{ colorScheme: "dark" }} />
                      </div>
                    </div>

                    {/* Fees — read-only, auto-calculated from fee grid */}
                    {(form.pickupLocation || form.dropoffLocation) && (
                      <div className="bg-[#0a0a0a] border border-white/8 rounded-xl p-3 space-y-1.5">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Frais appliqués</p>
                        {form.pickupLocation && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A96A] inline-block" />
                              Livraison
                            </span>
                            <span className="font-semibold text-white">
                              {form.deliveryFee > 0 ? `${form.deliveryFee} DH` : <span className="text-green-400">Inclus</span>}
                            </span>
                          </div>
                        )}
                        {form.dropoffLocation && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A96A] inline-block" />
                              Récupération
                            </span>
                            <span className="font-semibold text-white">
                              {form.recoveryFee > 0 ? `${form.recoveryFee} DH` : <span className="text-green-400">Inclus</span>}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {durationDays > 0 && (
                      <div className="bg-[#0a0a0a] border border-white/8 rounded-xl p-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500">
                          <span>
                            {effectivePrice} DH × {durationDays} jour(s)
                            {car.discount && car.discount > 0 && (
                              <span className="ml-1 text-[#D4A96A] font-semibold">(-{car.discount}%)</span>
                            )}
                          </span>
                          <span>{locationPrice} DH</span>
                        </div>
                        {form.deliveryFee > 0 && (
                          <div className="flex justify-between text-gray-500">
                            <span>Frais livraison</span>
                            <span>+{form.deliveryFee} DH</span>
                          </div>
                        )}
                        {form.recoveryFee > 0 && (
                          <div className="flex justify-between text-gray-500">
                            <span>Frais récupération</span>
                            <span>+{form.recoveryFee} DH</span>
                          </div>
                        )}
                        <div className="flex justify-between font-black text-white text-lg border-t border-white/8 pt-2">
                          <span>Total HT</span>
                          <span className="text-[#D4A96A]">{totalHT} DH</span>
                        </div>
                      </div>
                    )}

                    <button onClick={handleNextStep} className="w-full yellow-btn py-3.5 rounded-xl font-bold">
                      {t("car.detail.next")}
                    </button>
                  </div>
                )}

                {step === "form" && (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Detailed summary table */}
                    <div className="bg-[#0a0a0a] border border-[#D4A96A]/20 rounded-xl overflow-hidden text-xs mb-1">
                      {/* Header */}
                      <div className="grid grid-cols-2 border-b border-white/8">
                        <div className="px-3 py-2 text-center font-bold text-[#D4A96A] uppercase tracking-wider border-r border-white/8">Livraison</div>
                        <div className="px-3 py-2 text-center font-bold text-[#D4A96A] uppercase tracking-wider">Récupération</div>
                      </div>
                      {/* Location row */}
                      <div className="grid grid-cols-2 border-b border-white/8">
                        <div className="px-3 py-2 border-r border-white/8">
                          <p className="text-gray-600 mb-0.5">Lieu</p>
                          <p className="text-white font-semibold truncate">{form.pickupLocation || "—"}</p>
                        </div>
                        <div className="px-3 py-2">
                          <p className="text-gray-600 mb-0.5">Lieu</p>
                          <p className="text-white font-semibold truncate">{form.dropoffLocation || "—"}</p>
                        </div>
                      </div>
                      {/* Date row */}
                      <div className="grid grid-cols-2 border-b border-white/8">
                        <div className="px-3 py-2 border-r border-white/8">
                          <p className="text-gray-600 mb-0.5">Date</p>
                          <p className="text-white font-semibold">{form.pickupDate || "—"}</p>
                        </div>
                        <div className="px-3 py-2">
                          <p className="text-gray-600 mb-0.5">Date</p>
                          <p className="text-white font-semibold">{form.dropoffDate || "—"}</p>
                        </div>
                      </div>
                      {/* Time row */}
                      <div className="grid grid-cols-2 border-b border-white/8">
                        <div className="px-3 py-2 border-r border-white/8">
                          <p className="text-gray-600 mb-0.5">Heure</p>
                          <p className="text-white font-semibold">{form.pickupTime || "—"}</p>
                        </div>
                        <div className="px-3 py-2">
                          <p className="text-gray-600 mb-0.5">Heure</p>
                          <p className="text-white font-semibold">{form.dropoffTime || "—"}</p>
                        </div>
                      </div>
                      {/* Sommaire */}
                      <div className="px-3 py-2 border-b border-white/8 bg-white/[0.02]">
                        <p className="font-bold text-[#D4A96A] uppercase tracking-wider mb-2">Sommaire</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-gray-400">
                            <span>Durée</span>
                            <span className="font-semibold text-white">{durationDays} Jour{durationDays > 1 ? "s" : ""}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>Prix de Location</span>
                            <span className="font-semibold text-white">
                              {locationPrice} DH
                              {durationDays > 0 && <span className="text-gray-600 ml-1">({effectivePrice} DH/j)</span>}
                            </span>
                          </div>
                          {(form.deliveryFee > 0 || form.recoveryFee > 0) && (
                            <div className="flex justify-between text-gray-400">
                              <span>Frais</span>
                              <span className="text-right">
                                {form.deliveryFee > 0 && <span className="block text-white font-semibold">Livraison : {form.deliveryFee} DH</span>}
                                {form.recoveryFee > 0 && <span className="block text-white font-semibold">Récupération : {form.recoveryFee} DH</span>}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Total */}
                      <div className="px-3 py-2.5 flex justify-between items-center bg-[#D4A96A]/10">
                        <span className="font-black text-[#D4A96A] uppercase tracking-wide text-[11px]">Total à payer</span>
                        <span className="font-black text-[#D4A96A] text-base">{totalHT} DH <span className="text-[10px] font-normal text-gray-500">HT</span></span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep("dates")}
                      className="w-full text-xs text-gray-500 hover:text-[#D4A96A] transition-colors text-left mb-1"
                    >
                      ← Modifier les dates / lieux
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input placeholder={`${t("car.detail.firstName")} *`} value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          className={inputCls(errors.firstName)} />
                        {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <input placeholder={`${t("car.detail.lastName")} *`} value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          className={inputCls(errors.lastName)} />
                        {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <input type="tel" placeholder={`${t("car.detail.phone")} *`} value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={inputCls(errors.phone)} />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <input type="email" placeholder={`${t("car.detail.email")} *`} value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputCls(errors.email)} />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <input placeholder={`${t("car.detail.license")} *`} value={form.license}
                        onChange={(e) => setForm({ ...form, license: e.target.value })}
                        className={inputCls(errors.license)} />
                      {errors.license && <p className="text-red-400 text-xs mt-1">{errors.license}</p>}
                    </div>

                    <textarea placeholder={t("car.detail.messagePlaceholder")} value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={2}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4A96A]/60 transition-colors resize-none placeholder-gray-600" />

                    <button type="submit" disabled={submitting}
                      className="w-full yellow-btn py-3.5 rounded-xl font-bold disabled:opacity-60">
                      {submitting ? "..." : t("car.detail.confirm")}
                    </button>

                    {/* Véhicule similaire notice */}
                    <div className="flex items-start gap-2 bg-white/[0.03] border border-white/8 rounded-xl px-3 py-3 text-xs text-gray-500 leading-relaxed">
                      <span className="text-[#D4A96A] shrink-0 mt-0.5">ℹ</span>
                      <span>En cas d'indisponibilité de ce véhicule, un véhicule de catégorie et de gamme similaires pourra vous être proposé, sous réserve d'accord préalable.</span>
                    </div>
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
