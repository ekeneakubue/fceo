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
    fetch("/api/gallery")
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        let data: any = [];
        try {
          data = await r.json();
        } catch {
          data = [];
        }
        setGalleryItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setGalleryItems([]);
      })
      .finally(() => setGalleryLoading(false));
  }, []);
  return (
    <div>
      <Navbar />
      <HeroSlider
        autoPlayMs={5000}
        slides={[
          {
            imageUrl: "/images/home-banner.jpg",
            heading: "Welcome to Federal College of Education, Ofeme Ohuhu",
            lines: [
              "To Educate to Liberate the Mind",
              "Committed to Excellence in Teacher Education",
            ],
          },
          {
            imageUrl: "/images/1.jfif",
            heading: "Quality Teacher Education",
            lines: ["Shaping the future of classrooms", "Inspiring excellence"],
          },
          {
            imageUrl: "/images/2.jfif",
            heading: "Community and Impact",
            lines: ["Building strong communities", "Driving positive change"],
          },
        ]}
      />
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
      <section className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Who We Are</h2>
          <p className="text-black/80 dark:text-white/80 leading-relaxed">
            Federal College of Education, Ofeme Ohuhu prepares the next generation of educators,
            leaders, and innovators. We combine rigorous academics with community-centered practice
            to improve teaching and learning outcomes for all.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 bg-white/70 dark:bg-white/5">
              <h3 className="font-semibold text-lg">Mission</h3>
              <p className="mt-2 text-sm text-black/80 dark:text-white/80">To educate and inspire through excellence in teacher education, research, and service.</p>
            </div>
            <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 bg-white/70 dark:bg-white/5">
              <h3 className="font-semibold text-lg">Vision</h3>
              <p className="mt-2 text-sm text-black/80 dark:text-white/80">To be a transformative hub where educators lead change in classrooms and communities.</p>
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 bg-white/70 dark:bg-white/5">
            <h3 className="font-semibold text-lg">Fast Facts</h3>
            <ul className="mt-3 text-sm space-y-2 text-black/80 dark:text-white/80">
              <li>• 10+ academic programmes</li>
              <li>• 4,000+ students</li>
              <li>• 150+ faculty & staff</li>
              <li>• Active community partnerships</li>
            </ul>
          </div>
        </aside>
      </section>
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-semibold">Our Values</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {["Excellence", "Equity", "Integrity", "Innovation"].map((v) => (
            <div key={v} className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 bg-white/70 dark:bg-white/5">
              <div className="text-2xl">🎓</div>
              <h3 className="mt-2 font-semibold">{v}</h3>
              <p className="mt-1 text-sm text-black/80 dark:text-white/80">We strive to embody {v.toLowerCase()} in our teaching, research, and service.</p>
            </div>
          ))}
        </div>
      </section>
      {/* Gallery preview */}
      {(!galleryLoading && galleryItems.length > 0) && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold">Gallery</h2>
            <Link href="/gallery" className="text-sm text-[rgb(3,158,29)] hover:underline">View all</Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {galleryItems.slice(0, 8).map((img, idx) => (
              <div key={img.id || idx} className="group relative rounded-xl overflow-hidden border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5">
                <div className="aspect-video bg-black/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.imageDataUrl}
                    alt={img.title || `Gallery image ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between text-xs text-black/60 dark:text-white/60">
                    <span className="truncate max-w-[70%]">{img.title || "Untitled"}</span>
                    <span>{img.createdAt && new Date(img.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
