"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

type NewsPost = {
  id: string;
  title: string;
  date?: string | null;
  body?: string | null;
  imageDataUrl?: string | null;
};

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/news", { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error || "Failed to load news");
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <section className="relative w-full md:h-[40vh] h-[28vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/home-banner.jpg')" }}>
          <div className="w-full h-full bg-[rgba(20,20,52,0.55)] grid place-items-center text-center px-6">
            <h1 className="text-white text-3xl md:text-5xl font-bold">News</h1>
          </div>
        </div>
      </section>
      <main className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center text-slate-500 py-12">Loading news...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-slate-500 py-12">No news posts yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article
                key={p.id}
                className="rounded-xl overflow-hidden border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5 flex flex-col"
              >
                <div className="aspect-video bg-black/10 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageDataUrl || "/images/news/news1.jpg"}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  {p.date ? <p className="text-xs text-black/60 dark:text-white/60">{p.date}</p> : null}
                  <h3 className="mt-1 font-semibold">{p.title}</h3>
                  {p.body ? (
                    <p className="mt-1 text-sm text-black/70 dark:text-white/70 line-clamp-3">{p.body}</p>
                  ) : null}
                  <Link
                    href={`/news/${p.id}`}
                    className="mt-3 inline-block text-sm font-medium text-[rgb(3,158,29)] hover:underline underline-offset-4"
                  >
                    Read more...
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
