"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import Topbar from "../../../components/dashboard/Topbar";

type NewsItem = {
  id?: string;
  title: string;
  date?: string;
  body?: string;
  imageDataUrl?: string;
};

export default function NewsAdminPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [body, setBody] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [showView, setShowView] = useState(false);
  const [viewIndex, setViewIndex] = useState<number>(-1);

  useEffect(() => {
    fetch("/api/news")
      .then(async (r) => setItems(await r.json()))
      .catch(() => {});
  }, []);

  const persist = (next: NewsItem[]) => setItems(next);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <Sidebar />
      <main className="px-0">
        <Topbar />
        <div className="px-6 py-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">News</h1>
              <p className="text-black/80 dark:text-white/80 mt-2">Create and manage news posts.</p>
            </div>
            <button
              className="h-10 px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium"
              onClick={() => {
                setEditIndex(-1);
                setTitle("");
                setDate("");
                setBody("");
                setImageDataUrl(undefined);
                setShowAdd(true);
              }}
            >
              Add news
            </button>
          </div>

          {showAdd && (
            <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center" role="dialog" aria-modal="true">
              <form
                className="w-[95%] max-w-2xl grid gap-4 md:grid-cols-2 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 p-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const item: NewsItem = { title, date, body, imageDataUrl };
                  fetch("/api/news", {
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
                <div className="md:col-span-2 text-lg font-semibold">{editIndex >= 0 ? "Edit news" : "Add news"}</div>
                <div>
                  <label className="block text-xs mb-1">Title</label>
                  <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs mb-1">Date</label>
                  <input type="date" className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs mb-1">Body</label>
                  <textarea className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black min-h-[120px]" value={body} onChange={(e) => setBody(e.target.value)} />
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

          <div className="mt-6 rounded-xl border border-black/[.08] dark:border-white/[.145] overflow-hidden bg-white/70 dark:bg-white/5">
            <div className="px-4 py-3 bg-black/5 dark:bg-white/10 font-semibold">All News</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80">
                  <tr>
                    <th className="text-left px-4 py-2">Image</th>
                    <th className="text-left px-4 py-2">Title</th>
                    <th className="text-left px-4 py-2">Date</th>
                    <th className="text-left px-4 py-2">Body</th>
                    <th className="text-left px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/10">
                  {items.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4" colSpan={5}>No news yet. Click "Add news" to create one.</td>
                    </tr>
                  ) : (
                    items.map((n, idx) => (
                      <tr key={(n.title || "news") + "-" + idx} className="hover:bg-black/5 dark:hover:bg-white/10">
                        <td className="px-4 py-2">
                          <div className="w-20 aspect-video rounded overflow-hidden ring-1 ring-black/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={n.imageDataUrl || "/images/2.jfif"} alt={n.title} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-4 py-2 align-top">{n.title}</td>
                        <td className="px-4 py-2 align-top">{n.date || ""}</td>
                        <td className="px-4 py-2 align-top max-w-[480px]">
                          <div className="line-clamp-2">{n.body}</div>
                        </td>
                        <td className="px-4 py-2 align-top">
                          <div className="flex items-center gap-2">
                            <button
                              className="h-8 px-3 rounded border border-black/20 text-xs"
                              onClick={() => {
                                setViewIndex(idx);
                                setShowView(true);
                              }}
                            >
                              View
                            </button>
                            <button
                              className="h-8 px-3 rounded border border-black/20 text-xs"
                              onClick={() => {
                                setEditIndex(idx);
                                setTitle(n.title || "");
                                setDate(n.date || "");
                                setBody(n.body || "");
                                setImageDataUrl(n.imageDataUrl);
                                setShowAdd(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="h-8 px-3 rounded bg-red-600 text-white text-xs"
                              onClick={() => {
                                const id = (items as any)[idx]?.id;
                                if (!id) {
                                  const next = items.filter((_, i) => i !== idx);
                                  persist(next);
                                  return;
                                }
                                fetch(`/api/news?id=${encodeURIComponent(String(id))}`, { method: "DELETE" })
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
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {showView && viewIndex >= 0 && items[viewIndex] && (
            <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center" role="dialog" aria-modal="true">
              <div className="w-[95%] max-w-2xl rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="text-lg font-semibold">{items[viewIndex].title}</h2>
                  <button
                    onClick={() => setShowView(false)}
                    className="h-9 px-3 rounded border border-black/20 text-sm"
                  >
                    Close
                  </button>
                </div>
                <p className="text-xs text-black/60 dark:text-white/60">{items[viewIndex].date || ""}</p>
                {items[viewIndex].imageDataUrl && (
                  <div className="mt-3 w-full aspect-video rounded overflow-hidden ring-1 ring-black/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={items[viewIndex].imageDataUrl as string} alt={items[viewIndex].title} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="mt-4 text-sm text-black/80 dark:text-white/80 whitespace-pre-wrap">{items[viewIndex].body}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


