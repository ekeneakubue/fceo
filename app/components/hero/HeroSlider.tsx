"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  imageUrl: string;
  heading: string;
  lines: string[];
};

type HeroSliderProps = {
  slides?: Slide[];
  autoPlayMs?: number;
};

export default function HeroSlider({
  slides,
  autoPlayMs = 5000,
}: HeroSliderProps) {
  const defaultSlides: Slide[] = [
    {
      imageUrl: "/images/home-banner.jpg",
      heading: "Welcome to Federal College of Education, Ofeme Ohuhu",
      lines: [
        "To Educate to Liberate the Mind",
        "Committed to Excellence in Teacher Education",
      ],
    },
  ];

  const allSlides = slides && slides.length > 0 ? slides : defaultSlides;
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<number | null>(null);

  const next = useCallback(
    () => setIndex((prev) => (prev + 1) % allSlides.length),
    [allSlides.length]
  );
  const prev = useCallback(
    () => setIndex((prev) => (prev - 1 + allSlides.length) % allSlides.length),
    [allSlides.length]
  );

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

  return (
    <section
      className="relative w-full md:h-[90vh] h-[25vh] overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-roledescription="carousel"
      aria-label="Hero image slider"
    >
      {/* Slides */}
      {allSlides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${allSlides.length}`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.imageUrl}')` }}
          >
            <div className="w-full h-full bg-[rgba(20,20,52,0.517)] px-6 py-8 md:px-16 md:py-12 flex items-center justify-center text-center">
              <div className="max-w-4xl">
                <h2
                  data-aos="fade-up"
                  data-aos-duration="2000"
                  className="text-white uppercase font-bold md:text-[45px] text-[15px] leading-tight md:leading-[3.5rem] md:w-3/5 mx-auto"
                >
                  {slide.heading}
                </h2>
                <p
                  data-aos="fade-up"
                  data-aos-duration="2000"
                  className="hidden md:block text-white text-[23px] md:w-[96%] mt-2 mx-auto"
                >
                  <span className="mr-2">🏅</span> {slide.lines[0]} &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="mr-2">🏅</span> {slide.lines[1]}
                </p>
                <p
                  data-aos="fade-up"
                  data-aos-duration="2000"
                  className="md:hidden text-white text-[16px] md:w-[100%] mt-2 mx-auto"
                >
                  <span className="mr-2">🏅</span> {slide.lines[0]} <br />
                  <span className="mr-2">🏅</span> {slide.lines[1]}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      {allSlides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full w-10 h-10 grid place-items-center"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full w-10 h-10 grid place-items-center"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {allSlides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === index ? "bg-white" : "bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}


