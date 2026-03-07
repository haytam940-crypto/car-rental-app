"use client";
import { useState, useEffect } from "react";

const SLIDES = [
  {
    url: "/sahara1.jpg",
    label: "Sahara, Maroc",
  },
  {
    url: "/sahara2.jpg",
    label: "Désert marocain",
  },
  {
    url: "/marrakech.jpg",
    label: "Marrakech, Médina",
  },
];

const INTERVAL = 2000; // ms between slides

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (index: number) => {
    if (transitioning || index === current) return;
    setPrev(current);
    setCurrent(index);
    setTransitioning(true);
    setTimeout(() => {
      setPrev(null);
      setTransitioning(false);
    }, 300);
  };

  return (
    <>
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.url}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300"
          style={{
            backgroundImage: `url('${slide.url}')`,
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : i === prev ? 0 : 0,
          }}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40" style={{ zIndex: 2 }} />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" style={{ zIndex: 2 }} />

      {/* Slide label + dots */}
      <div className="absolute bottom-44 left-0 right-0 flex flex-col items-center gap-3" style={{ zIndex: 10 }}>
        <span className="text-white/40 text-xs uppercase tracking-widest font-medium">
          {SLIDES[current].label}
        </span>
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2 bg-[#F5C518]"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
