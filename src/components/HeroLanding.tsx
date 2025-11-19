"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  { src: "/file.svg", alt: "Placeholder 1" },
  { src: "/globe.svg", alt: "Placeholder 2" },
  { src: "/next.svg", alt: "Placeholder 3" },
  { src: "/vercel.svg", alt: "Placeholder 4" },
  { src: "/window.svg", alt: "Placeholder 5" },
];

export default function HeroLanding() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="montserrat relative bg-black text-white">
      {/* Slider */}
      <div className="relative h-[70vh] sm:h-[75vh] w-full overflow-hidden">
        {slides.map((s, i) => (
          <div
            key={s.alt}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              priority={i === index}
              className="object-contain"
            />
          </div>
        ))}

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Streamlined Restaurant Scheduling Solutions</h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-200">
              Elevated dining and seamless reservations. Explore our curated menu and book your experience.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-white text-black px-5 py-2 font-medium hover:bg-zinc-200 transition-colors"
              >
                Reserve Table
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-white text-white px-5 py-2 font-medium hover:bg-white/10 transition-colors"
              >
                Explore Our Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}