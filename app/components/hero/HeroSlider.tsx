"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type HeroSlide = {
  id?: string;
  heading: string;
  imageDataUrl: string;
  ctaText?: string | null;
  ctaLink?: string | null;
  slideOrder?: number;
};

type HeroSliderProps = {
  autoPlayMs?: number;
};

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: "fallback",
    heading: "Welcome to Federal College of Education, Ofeme Ohuhu",
    imageDataUrl: "/images/home-banner.jpg",
    ctaText: "Apply Now",
    ctaLink: "/admission/application-form",
  },
];

export default function HeroSlider({ autoPlayMs = 6000 }: HeroSliderProps) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    fetch("/api/hero")
      .then(async (r) => {
        const data = await r.json();
        setSlides(Array.isArray(data) ? data : []);
      })
      .catch(() => setSlides([]))
      .finally(() => setLoading(false));
  }, []);

  const allSlides = slides.length > 0 ? slides : FALLBACK_SLIDES;

  const next = useCallback(
    () => setIndex((prev) => (prev + 1) % allSlides.length),
    [allSlides.length]
  );
  const prev = useCallback(
    () => setIndex((prev) => (prev - 1 + allSlides.length) % allSlides.length),
    [allSlides.length]
  );

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (isHovering || allSlides.length <= 1) return;
    timerRef.current = window.setInterval(next, autoPlayMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isHovering, autoPlayMs, allSlides.length, next]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (loading) {
    return (
      <section className="relative w-full h-[40vh] md:h-[90vh] overflow-hidden bg-slate-900">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-800 via-slate-900 to-brand-green-dark/40" />
        <div className="relative h-full flex flex-col items-center justify-center gap-4 px-6">
          <div className="h-4 w-32 rounded-full bg-white/20 animate-pulse" />
          <div className="h-10 w-full max-w-xl rounded-lg bg-white/10 animate-pulse" />
          <div className="h-11 w-36 rounded-lg bg-white/10 animate-pulse mt-2" />
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full h-[40vh] md:h-[90vh] overflow-hidden bg-slate-900"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-roledescription="carousel"
      aria-label="Hero image slider"
    >
      {allSlides.map((slide, i) => (
        <div
          key={slide.id || i}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${allSlides.length}`}
          aria-hidden={i !== index}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.imageDataUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/55 to-slate-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

          <div className="relative z-10 h-full flex items-center px-6 md:px-16 lg:px-24">
            <div className="max-w-3xl">
              <span
                data-aos="fade-up"
                className="inline-flex items-center rounded-full border border-brand-green/40 bg-brand-green/15 px-4 py-1 text-xs md:text-sm font-semibold text-brand-green-light tracking-wide"
              >
                Federal College of Education, Ofeme Ohuhu
              </span>
              <h1
                data-aos="fade-up"
                data-aos-delay="100"
                className="mt-4 md:mt-6 text-white font-bold text-2xl sm:text-3xl md:text-5xl lg:text-[3.25rem] leading-tight tracking-tight"
              >
                {slide.heading}
              </h1>
              {slide.ctaText && slide.ctaLink && (
                <div data-aos="fade-up" data-aos-delay="200" className="mt-6 md:mt-8 flex flex-wrap gap-3">
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex h-11 md:h-12 items-center rounded-lg bg-brand-green px-6 md:px-8 text-sm md:text-base font-semibold text-white hover:bg-brand-green-dark transition-colors shadow-lg shadow-brand-green/25"
                  >
                    {slide.ctaText}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {allSlides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/25 transition-colors grid place-items-center"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/25 transition-colors grid place-items-center"
          >
            ›
          </button>

          <div className="absolute bottom-6 md:bottom-8 left-6 md:left-16 lg:left-24 z-20 flex items-center gap-3">
            {allSlides.map((slide, i) => (
              <button
                key={slide.id || i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === index ? "w-10 bg-brand-green" : "w-6 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <div className="absolute bottom-6 md:bottom-8 right-6 md:right-16 z-20 text-xs md:text-sm font-medium text-white/70 tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(allSlides.length).padStart(2, "0")}
          </div>
        </>
      )}
    </section>
  );
}
