"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import Topbar from "../../../components/dashboard/Topbar";

type GalleryItem = {
  title?: string;
  imageDataUrl: string;
  date?: string;
};

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch("/api/gallery").then(async (r) => setItems(await r.json())).catch(() => {});
  }, []);

  const persist = (next: GalleryItem[]) => setItems(next);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <Sidebar />
      <main className="px-0">
        <Topbar />
        <div className="px-6 py-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Gallery</h1>
              <p className="text-black/80 dark:text-white/80 mt-2">Upload and organize media.</p>
            </div>
            <button
              className="h-10 px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium"
              onClick={() => {
                setTitle("");
                setDate("");
                setImageDataUrl(undefined);
                setShowAdd(true);
              }}
            >
              Add image
            </button>
          </div>

          {showAdd && (
            <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center" role="dialog" aria-modal="true">
              <form
                className="w-[95%] max-w-2xl grid gap-4 md:grid-cols-2 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 p-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!imageDataUrl) return;
                  const item: GalleryItem = { title, date, imageDataUrl };
                  fetch("/api/gallery", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(item),
                  })
                    .then(async (r) => {
                      const created = await r.json();
                      const next = [...items, created];
                      persist(next);
                    })
                    .catch(() => {});
                  setShowAdd(false);
                }}
              >
                <div className="md:col-span-2 text-lg font-semibold">Add image</div>
                <div>
                  <label className="block text-xs mb-1">Title (optional)</label>
                  <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs mb-1">Date (optional)</label>
                  <input type="date" className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return setImageDataUrl(undefined);
                      const reader = new FileReader();
                      reader.onload = () => setImageDataUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }}
                    required
                  />
                  {imageDataUrl && (
                    <div className="mt-2 w-full max-w-sm aspect-video rounded overflow-hidden ring-1 ring-black/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageDataUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setShowAdd(false)} className="h-10 px-4 rounded border border-black/20 text-sm">Cancel</button>
                  <button type="submit" className="h-10 px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium">Save</button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((g, idx) => (
              <div key={(g.title || "img") + "-" + idx} className="rounded-xl overflow-hidden border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5">
                <div className="aspect-video bg-black/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.imageDataUrl} alt={g.title || "Gallery image"} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-black/60 dark:text-white/60">{g.date || ""}</p>
                  <h3 className="mt-1 font-semibold">{g.title || "Untitled"}</h3>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      className="h-8 px-3 rounded bg-red-600 text-white text-xs"
                      onClick={() => {
                        fetch(`/api/gallery?id=${encodeURIComponent(String((items as any)[idx]?.id || ""))}`, { method: "DELETE" })
                          .then(() => {
                            const next = items.filter((_, i) => i !== idx);
                            persist(next);
                          })
                          .catch(() => {});
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}


