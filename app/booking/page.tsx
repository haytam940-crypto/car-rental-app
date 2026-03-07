"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Calendar, Car, CreditCard, Phone } from "lucide-react";

function BookingContent() {
  const params = useSearchParams();
  const id = params.get("id") || "RES-000000";
  const car = params.get("car") || "Véhicule";
  const total = params.get("total") || "0";
  const days = params.get("days") || "0";
  const pickup = params.get("pickup") || "";
  const dropoff = params.get("dropoff") || "";

  return (
    <main>
      <Header />

      <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
        <div className="max-w-xl mx-auto">
          {/* Success card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-10 text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h1 className="text-2xl font-black mb-2">Réservation envoyée !</h1>
              <p className="text-green-100 text-sm">Nous confirmerons votre réservation sous 2h</p>
            </div>

            {/* Body */}
            <div className="p-8 space-y-5">
              {/* Réservation ID */}
              <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Numéro de réservation</p>
                <p className="text-xl font-black text-[#1a1a2e] tracking-widest">{id}</p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <Car size={18} className="text-[#e63946] shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Véhicule</p>
                    <p className="font-semibold text-[#1a1a2e] text-sm">{car}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <Calendar size={18} className="text-[#e63946] shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Période</p>
                    <p className="font-semibold text-[#1a1a2e] text-sm">{pickup} → {dropoff} ({days} jours)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#e63946]/5 border border-[#e63946]/20">
                  <CreditCard size={18} className="text-[#e63946] shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Montant total</p>
                    <p className="font-black text-[#e63946] text-lg">{total} DH</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                <div>
                  <p className="font-semibold text-yellow-700 text-sm">En attente de confirmation</p>
                  <p className="text-yellow-600 text-xs">Notre équipe vous contactera sous 2 heures</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Link
                  href="/fleet"
                  className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-semibold text-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Voir d&apos;autres voitures
                </Link>
                <a
                  href="tel:+212600000000"
                  className="flex-1 bg-[#1a1a2e] text-white py-3 rounded-xl text-sm font-semibold text-center flex items-center justify-center gap-2 hover:bg-[#e63946] transition-colors"
                >
                  <Phone size={14} />
                  Nous appeler
                </a>
              </div>
            </div>
          </div>

          {/* Note */}
          <p className="text-center text-gray-400 text-xs mt-6">
            Une confirmation vous sera envoyée par email et SMS.
            <br />
            Pour toute urgence : <a href="tel:+212600000000" className="text-[#e63946]">+212 6 00 00 00 00</a>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <BookingContent />
    </Suspense>
  );
}
