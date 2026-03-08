"use client";
import { useEffect, useState } from "react";
import { X, Tag, Clock, Sparkles } from "lucide-react";
import { getActivePromotion } from "@/lib/store";
import { Promotion } from "@/lib/data";

export default function PromoBar({ onVisible }: { onVisible?: (v: boolean) => void }) {
  const [promo, setPromo] = useState<Promotion | null>(null);
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("promo_dismissed") === "1";
    if (isDismissed) { onVisible?.(false); return; }
    const p = getActivePromotion();
    if (!p) { onVisible?.(false); return; }
    const end = new Date(p.endDate + "T23:59:59");
    const diff = Math.ceil((end.getTime() - Date.now()) / 86400000);
    setDaysLeft(Math.max(0, diff));
    setPromo(p);
    setDismissed(false);
    onVisible?.(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("promo_dismissed", "1");
    setDismissed(true);
    onVisible?.(false);
  };

  if (!promo || dismissed) return null;

  const applyLabel =
    promo.applyTo === "cars" ? "locations voitures"
    : promo.applyTo === "excursions" ? "excursions"
    : "toutes prestations";

  const marqueeContent = `✦ ${promo.name} · -${promo.discountPercent}% sur ${applyLabel} · ${promo.description} · ${daysLeft > 0 ? `${daysLeft} jour${daysLeft > 1 ? "s" : ""} restant${daysLeft > 1 ? "s" : ""}` : "Dernier jour !"} ✦`;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[80] h-11 flex items-center overflow-hidden select-none"
      style={{
        background: "linear-gradient(90deg, #92600a 0%, #b8894e 20%, #D4A96A 40%, #f0c878 55%, #D4A96A 70%, #b8894e 85%, #92600a 100%)",
      }}
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
          animation: "promoShimmer 2.8s ease-in-out infinite",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Left badge */}
      <div className="relative shrink-0 flex items-center gap-1.5 bg-black/20 text-black font-black text-xs px-3 h-full border-r border-black/15">
        <Sparkles size={12} />
        <span>PROMO</span>
      </div>

      {/* Scrolling content */}
      <div className="relative flex-1 overflow-hidden mx-3">
        <div
          className="flex items-center gap-2 text-black font-semibold text-sm whitespace-nowrap"
          style={{ animation: "promoScroll 22s linear infinite" }}
        >
          <Tag size={12} className="shrink-0" />
          <span className="font-black">{promo.name}</span>
          <span className="opacity-60 mx-1">—</span>
          <span>{promo.description}</span>
          <span className="bg-black/20 text-black font-black text-xs px-2 py-0.5 rounded-full mx-2">
            -{promo.discountPercent}% {applyLabel}
          </span>
          <span className="opacity-70 mx-1">·</span>
          <Clock size={11} className="shrink-0" />
          <span className="text-xs">
            {daysLeft > 0
              ? `${daysLeft} jour${daysLeft > 1 ? "s" : ""} restant${daysLeft > 1 ? "s" : ""}`
              : "Dernier jour !"}
          </span>
          {/* Duplicate for seamless loop */}
          <span className="mx-10 opacity-30">✦</span>
          <Tag size={12} className="shrink-0" />
          <span className="font-black">{promo.name}</span>
          <span className="opacity-60 mx-1">—</span>
          <span>{promo.description}</span>
          <span className="bg-black/20 text-black font-black text-xs px-2 py-0.5 rounded-full mx-2">
            -{promo.discountPercent}% {applyLabel}
          </span>
          <span className="opacity-70 mx-1">·</span>
          <Clock size={11} className="shrink-0" />
          <span className="text-xs">
            {daysLeft > 0
              ? `${daysLeft} jour${daysLeft > 1 ? "s" : ""} restant${daysLeft > 1 ? "s" : ""}`
              : "Dernier jour !"}
          </span>
        </div>
      </div>

      {/* Discount pill */}
      <div className="relative shrink-0 bg-black text-[#D4A96A] font-black text-sm px-3 py-0.5 rounded-full mx-2">
        -{promo.discountPercent}%
      </div>

      {/* Close */}
      <button
        onClick={dismiss}
        className="relative shrink-0 mr-3 text-black/50 hover:text-black transition-colors"
        aria-label="Fermer"
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes promoShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes promoScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
