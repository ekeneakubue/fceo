"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

type LeadershipItem = {
  id: string;
  imageDataUrl: string;
  fullName?: string | null;
  profile?: string | null;
  officeTitle: string;
};

const FALLBACK_LEADERS: LeadershipItem[] = [
  { id: "fallback-1", fullName: "", officeTitle: "Chairman", imageDataUrl: "/images/officers/pro-chancellor.jpg", profile: "" },
  {
    id: "fallback-2",
    fullName: "",
    officeTitle: "Provost",
    imageDataUrl: "/images/officers/provost.jpg",
    profile: "Ph.D(English), MA, BA, NCE, FICAN, NATRESL, MNATECEP.",
  },
  {
    id: "fallback-3",
    fullName: "",
    officeTitle: "Registrar",
    imageDataUrl: "/images/officers/registrar.jpg",
    profile: "M.Sc(PA), PGDPA, HND, MNIM, FCAI(JP).",
  },
  { id: "fallback-4", fullName: "", officeTitle: "Bursar", imageDataUrl: "/images/officers/bursar.jpg", profile: "B.Sc, CITM, FIIA, CNA" },
  {
    id: "fallback-5",
    fullName: "",
    officeTitle: "Librarian",
    imageDataUrl: "/images/officers/liberian.jpg",
    profile: "BLS, MLS, PDE, CCA, LRCN.",
  },
];

const isFeaturedOffice = (officeTitle: string) => {
  const title = officeTitle.trim().toLowerCase();
  return (
    title.includes("chairman") ||
    title.includes("pro-chancellor") ||
    title.includes("prochancellor") ||
    title === "provost"
  );
};

function LeaderCard({ leader }: { leader: LeadershipItem }) {
  return (
    <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5 overflow-hidden">
      <div className="aspect-[4/3] bg-black/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={leader.imageDataUrl}
          alt={leader.fullName || leader.officeTitle}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        {leader.fullName ? <h3 className="font-semibold">{leader.fullName}</h3> : null}
        <p className={`font-semibold ${leader.fullName ? "text-sm text-[rgb(3,158,29)] mt-0.5" : ""}`}>
          {leader.officeTitle}
        </p>
        <p className="text-sm text-black/70 dark:text-white/70 mt-1">{leader.profile}</p>
      </div>
    </div>
  );
}

export default function LeadershipPage() {
  const [leaders, setLeaders] = useState<LeadershipItem[]>(FALLBACK_LEADERS);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/leadership", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && Array.isArray(data) && data.length > 0) {
          setLeaders(data);
        }
      } catch {
        // keep fallback
      }
    })();
  }, []);

  const { featured, others } = useMemo(() => {
    const featuredList: LeadershipItem[] = [];
    const otherList: LeadershipItem[] = [];

    for (const leader of leaders) {
      if (isFeaturedOffice(leader.officeTitle)) {
        featuredList.push(leader);
      } else {
        otherList.push(leader);
      }
    }

    // Prefer Chairman / Pro-Chancellor then Provost on the first row
    featuredList.sort((a, b) => {
      const rank = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes("chairman") || t.includes("pro-chancellor") || t.includes("prochancellor")) return 0;
        if (t === "provost") return 1;
        return 2;
      };
      return rank(a.officeTitle) - rank(b.officeTitle);
    });

    return { featured: featuredList, others: otherList };
  }, [leaders]);

  return (
    <div>
      <Navbar />
      <section className="relative w-full md:h-[40vh] h-[28vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/home-banner.jpg')" }}>
          <div className="w-full h-full bg-[rgba(20,20,52,0.55)] grid place-items-center text-center px-6">
            <h1 className="text-white text-3xl md:text-5xl font-bold">Leadership</h1>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12 space-y-6">
        {featured.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            {featured.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} />
            ))}
          </div>
        )}
        {others.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
