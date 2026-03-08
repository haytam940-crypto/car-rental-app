"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Calendar, Car, CreditCard, Phone, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function BookingContent() {
  const params = useSearchParams();
  const { t } = useLanguage();
  const id = params.get("id") || "RES-000000";
  const car = params.get("car") || "Véhicule";
  const total = params.get("total") || "0";
  const days = params.get("days") || "0";
  const pickup = params.get("pickup") || "";
  const dropoff = params.get("dropoff") || "";

  return (
    <main className="bg-[#0a0a0a]">
      <Header />

      <div className="min-h-screen pt-28 pb-20 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-[#111111] border border-white/8 rounded-3xl overflow-hidden">
            <div className="bg-[#D4A96A] p-10 text-center">
              <div className="w-20 h-20 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={40} className="text-black" />
              </div>
              <h1 className="text-2xl font-black text-black mb-2">{t("booking.title")}</h1>
              <p className="text-black/70 text-sm">{t("booking.sub")}</p>
            </div>

            <div className="p-8 space-y-5">
              <div className="bg-[#0a0a0a] border border-[#D4A96A]/20 rounded-2xl p-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("booking.id")}</p>
                <p className="text-xl font-black text-[#D4A96A] tracking-widest">{id}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
                  <Car size={18} className="text-[#D4A96A] shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{t("booking.car")}</p>
                    <p className="font-semibold text-white text-sm">{car}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
                  <Calendar size={18} className="text-[#D4A96A] shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{t("booking.period")}</p>
                    <p className="font-semibold text-white text-sm">{pickup} → {dropoff} ({days} {t("booking.days")})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#D4A96A]/10 border border-[#D4A96A]/20">
                  <CreditCard size={18} className="text-[#D4A96A] shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{t("booking.total")}</p>
                    <p className="font-black text-[#D4A96A] text-lg">{total} DH</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/8 rounded-xl">
                <div className="w-3 h-3 bg-[#D4A96A] rounded-full animate-pulse shrink-0" />
                <div>
                  <p className="font-semibold text-white text-sm">{t("booking.pending")}</p>
                  <p className="text-gray-500 text-xs">{t("booking.pendingSub")}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  href="/fleet"
                  className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-semibold text-center text-gray-400 hover:border-[#D4A96A]/40 hover:text-white transition-colors flex items-center justify-center gap-1"
                >
                  {t("booking.otherCars")} <ChevronRight size={14} />
                </Link>
                <a
                  href="tel:+212666890899"
                  className="flex-1 yellow-btn py-3 rounded-xl text-sm font-semibold text-center flex items-center justify-center gap-2"
                >
                  <Phone size={14} />
                  {t("booking.call")}
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">
            {t("booking.note")}
            <br />
            <a href="tel:+212666890899" className="text-[#D4A96A]">+212.666.89.08.99</a>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">...</div>}>
      <BookingContent />
    </Suspense>
  );
}
