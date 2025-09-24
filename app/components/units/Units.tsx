"use client";
import React from "react";
import Link from "next/link";

export type UnitsProps = {
  unitLeader: string;
  item1: string;
  item2: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  homeLink: string;
  brandText: string;
  brandName: string;
  statement: string;
  vision: string;
  mission: string;
  unitPhone: string;
  unitEmail: string;
};

export default function Units(props: UnitsProps) {
  const {
    unitLeader,
    item1,
    item2,
    option1,
    option2,
    option3,
    option4,
    homeLink,
    brandText,
    brandName,
    statement,
    vision,
    mission,
    unitPhone,
    unitEmail,
  } = props;

  return (
    <div>
      {/* Hero/Banner */}
      <section className="relative w-full md:h-[40vh] h-[28vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/ict/1.png')" }}
        >
          <div className="w-full h-full bg-[rgba(20,20,52,0.55)] flex items-center justify-center text-center px-6">
            <div className="max-w-4xl">
              <p className="text-white/80 uppercase tracking-widest text-xs mb-2" data-aos="fade-up" data-aos-duration="1000">
                {brandText}
              </p>
              <h1 className="text-white text-2xl md:text-4xl font-bold" data-aos="fade-up" data-aos-duration="1400">
                {brandName}
              </h1>
              <div className="mt-3 text-white/80 text-sm" data-aos="fade-up" data-aos-duration="1600">
                <Link href={homeLink} className="hover:text-white">{item1}</Link>
                <span className="mx-2">/</span>
                <span className="text-white">{item2}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          <div data-aos="fade-up" className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-semibold">Overview</h2>
            <p className="text-black/80 dark:text-white/80 whitespace-pre-line">{statement}</p>
          </div>
          <div data-aos="fade-up" className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-semibold">Vision</h2>
            <p className="text-black/80 dark:text-white/80 whitespace-pre-line">{vision}</p>
          </div>
          <div data-aos="fade-up" className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-semibold">Mission</h2>
            <p className="text-black/80 dark:text-white/80 whitespace-pre-line">{mission}</p>
          </div>
        </div>

        {/* Side column */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-black/[.08] dark:border-white/[.145] p-6 bg-white/70 dark:bg-white/5">
            <h3 className="font-semibold text-lg">Contact</h3>
            <p className="mt-2 text-sm text-black/80 dark:text-white/80">Leader: {unitLeader}</p>
            <p className="mt-1 text-sm text-black/80 dark:text-white/80">Phone: {unitPhone}</p>
            <p className="mt-1 text-sm text-black/80 dark:text-white/80">Email: {unitEmail}</p>
          </div>
          <div className="rounded-lg border border-black/[.08] dark:border-white/[.145] p-6 bg-white/70 dark:bg-white/5">
            <h3 className="font-semibold text-lg">Units</h3>
            <ul className="mt-2 text-sm space-y-2">
              {[option1, option2, option3, option4].map((opt) => (
                <li key={opt} className="text-black/80 dark:text-white/80">{opt}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}


