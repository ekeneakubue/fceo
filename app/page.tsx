"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Link from "next/link";
import HeroSlider from "./components/hero/HeroSlider";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  type GalleryItem = {
    id?: string;
    title?: string;
    imageDataUrl: string;
    date?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    AOS.refresh();
  }, []);

  useEffect(() => {
    setGalleryLoading(true);
    fetch("/api/gallery", { cache: "no-store" })
      .then(async (r) => {
        let data: unknown = [];
        try {
          data = await r.json();
        } catch {
          data = [];
        }
        const rows = Array.isArray(data) ? data : [];
        setGalleryItems(
          rows.filter(
            (item): item is GalleryItem =>
              !!item &&
              typeof item === "object" &&
              typeof (item as GalleryItem).imageDataUrl === "string" &&
              (item as GalleryItem).imageDataUrl.length > 0
          )
        );
      })
      .catch(() => {
        setGalleryItems([]);
      })
      .finally(() => setGalleryLoading(false));
  }, []);

  useEffect(() => {
    if (!galleryLoading) {
      AOS.refresh();
    }
  }, [galleryLoading, galleryItems.length]);
  return (
    <div>
      <Navbar />
      <HeroSlider autoPlayMs={6000} />
      {/* About content preview */}
      <section className="bg-white dark:bg-black/20 border-y border-black/[.08] dark:border-white/[.14]">
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
          <ul className="flex gap-6 py-3 text-sm whitespace-nowrap">
            <li><Link className="hover:underline" href="/about/history">History</Link></li>
            <li><Link className="hover:underline" href="/about/vision-mission">Vision &amp; Mission</Link></li>
            <li><Link className="hover:underline" href="/about/leadership">Leadership</Link></li>
            <li><Link className="hover:underline" href="/about/campuses">Campuses</Link></li>
          </ul>
        </div>
      </section>
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/70">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-green/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl"
        />

        <div className="relative w-full max-w-4xl mx-auto px-6 py-12">
          <div className="space-y-8 text-center" data-aos="fade-up">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/10 px-4 py-1.5 text-sm font-semibold text-brand-green">
                About FCEO
              </span>
              <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                Who We Are
              </h2>
              <p className="mt-5 text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Federal College of Education, Ofeme Ohuhu prepares the next generation of educators,
                leaders, and innovators. We combine rigorous academics with community-centered practice
                to improve teaching and learning outcomes for all.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-left">
              <div className="group rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm hover:shadow-md hover:border-brand-green/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green grid place-items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg text-slate-900">Mission</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Our mission is to be a leading teacher educational institution where our teaching is rooted in competence,
                  research and exemplary character of our staff so students can enter the workforce with innovative skills,
                  knowledge and confidence in their chosen fields.
                </p>
              </div>
              <div className="group rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm hover:shadow-md hover:border-brand-green/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green grid place-items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg text-slate-900">Vision</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Our vision is to develop well-rounded, confident and responsible individuals who aspire to achieve their full
                  potentials. We provide a welcoming, happy, safe and supportive learning environment in which everyone is equal
                  and all achievements are celebrated.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/about"
                className="inline-flex h-11 items-center rounded-lg bg-brand-green px-6 text-sm font-medium text-white hover:bg-brand-green-dark transition-colors shadow-sm shadow-brand-green/20"
              >
                Learn more about us
              </Link>
              <Link
                href="/about/vision-mission"
                className="inline-flex h-11 items-center rounded-lg border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 hover:border-brand-green/40 hover:text-brand-green transition-colors"
              >
                Vision &amp; Mission
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(3,158,29,0.25),transparent_55%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(3,158,29,0.15),transparent_50%)]"
        />

        <div className="relative w-full max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-10 md:mb-14" data-aos="fade-up">
            <span className="inline-flex items-center rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-1.5 text-sm font-semibold text-brand-green-light">
              What We Stand For
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Our Core Values
            </h2>
            <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
              The principles that guide our teaching, research, and service to the college community.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-aos="fade-up" data-aos-delay="100">
            {[
              {
                title: "Excellence",
                description: "We pursue the highest standards in academics, character, and professional practice.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                ),
              },
              {
                title: "Equity",
                description: "We create an inclusive environment where every member of our community can thrive.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                ),
              },
              {
                title: "Integrity",
                description: "We act with honesty, accountability, and respect in all we do.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                ),
              },
              {
                title: "Innovation",
                description: "We embrace creative thinking and modern approaches to teacher education.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                ),
              },
            ].map((value) => (
              <div
                key={value.title}
                className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 hover:border-brand-green/40 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-green/20 text-brand-green-light grid place-items-center mb-5 group-hover:bg-brand-green group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    {value.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">{value.title}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/60 py-16 md:py-20 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-brand-green/10 blur-3xl"
        />

        <div className="relative w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-12" data-aos="fade-up">
            <div>
              <span className="inline-flex items-center rounded-full border border-brand-green/20 bg-brand-green/10 px-4 py-1.5 text-sm font-semibold text-brand-green">
                Campus Life
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                Gallery
              </h2>
              <p className="mt-3 text-slate-600 max-w-xl">
                Moments from academic life, events, and activities across Federal College of Education, Ofeme Ohuhu.
              </p>
            </div>
            <Link
              href="/gallery"
              className="inline-flex h-11 shrink-0 items-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:border-brand-green/40 hover:text-brand-green transition-colors shadow-sm"
            >
              View all photos
            </Link>
          </div>

          {galleryLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                  <div className="aspect-[4/3] w-full bg-slate-200/70 animate-pulse" />
                </div>
              ))}
            </div>
          ) : galleryItems.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/80 min-h-[320px] text-center px-6 py-12"
              data-aos="fade-up"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-green/10 text-brand-green grid place-items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                </svg>
              </div>
              <p className="text-slate-700 font-medium">Gallery photos will appear here soon.</p>
              <Link href="/gallery" className="mt-4 text-sm font-medium text-brand-green hover:underline">
                Visit gallery page
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {galleryItems.slice(0, 6).map((img, idx) => (
                <Link
                  key={img.id || `gallery-${idx}`}
                  href="/gallery"
                  className="group block overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow"
                  data-aos="fade-up"
                  data-aos-delay={idx * 50}
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.imageDataUrl}
                      alt={img.title || `Gallery image ${idx + 1}`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-sm font-medium text-white truncate">{img.title || "Untitled"}</p>
                      {img.createdAt && (
                        <p className="text-xs text-slate-300 mt-0.5">
                          {new Date(img.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
