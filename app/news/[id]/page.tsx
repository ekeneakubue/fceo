"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

type NewsPost = {
  id: string;
  title: string;
  date?: string | null;
  body?: string | null;
  imageDataUrl?: string | null;
};

export default function NewsDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("News post not found");
      return;
    }

    setLoading(true);
    setError(null);
    fetch(`/api/news?id=${encodeURIComponent(id)}`, { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error || "Failed to load news");
        setPost(data);
      })
      .catch((err: unknown) => {
        setPost(null);
        setError(err instanceof Error ? err.message : "Failed to load news");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <Navbar />
      <section className="relative w-full md:h-[40vh] h-[28vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/home-banner.jpg')" }}>
          <div className="w-full h-full bg-[rgba(20,20,52,0.55)] grid place-items-center text-center px-6">
            <h1 className="text-white text-3xl md:text-5xl font-bold">
              {loading ? "News" : post?.title || "News"}
            </h1>
          </div>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/news"
          className="inline-flex items-center text-sm font-medium text-[rgb(3,158,29)] hover:underline underline-offset-4"
        >
          ← Back to News
        </Link>

        {loading ? (
          <p className="text-center text-slate-500 py-16">Loading article...</p>
        ) : error || !post ? (
          <div className="text-center py-16">
            <p className="text-slate-600">{error || "News post not found"}</p>
            <Link
              href="/news"
              className="mt-4 inline-block text-sm font-medium text-[rgb(3,158,29)] hover:underline underline-offset-4"
            >
              Return to News
            </Link>
          </div>
        ) : (
          <article className="mt-8">
            <div className="aspect-video rounded-xl overflow-hidden bg-black/10 border border-black/[.08]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageDataUrl || "/images/news/news1.jpg"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            {post.date ? (
              <p className="mt-6 text-sm text-black/60 dark:text-white/60">{post.date}</p>
            ) : null}
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">{post.title}</h2>
            {post.body ? (
              <div className="mt-6 text-base leading-relaxed text-slate-700 whitespace-pre-wrap">
                {post.body}
              </div>
            ) : (
              <p className="mt-6 text-slate-500">No article content available.</p>
            )}
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
