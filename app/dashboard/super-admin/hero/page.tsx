"use client";

import { useEffect, useState } from "react";

type HeroSlide = {
  id?: string;
  heading: string;
  imageDataUrl: string;
  ctaText?: string | null;
  ctaLink?: string | null;
  slideOrder: number;
};

export default function HeroAdminPage() {
  const [items, setItems] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [heading, setHeading] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [slideOrder, setSlideOrder] = useState(1);

  const loadItems = () => {
    setLoading(true);
    fetch("/api/hero")
      .then(async (r) => {
        const data = await r.json();
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = (nextOrder?: number) => {
    setEditId(null);
    setHeading("");
    setImageDataUrl("");
    setCtaText("");
    setCtaLink("");
    setSlideOrder(nextOrder ?? items.length + 1);
  };

  const openCreate = () => {
    resetForm(items.length + 1);
    setShowModal(true);
  };

  const openEdit = (item: HeroSlide) => {
    setEditId(item.id || null);
    setHeading(item.heading);
    setImageDataUrl(item.imageDataUrl);
    setCtaText(item.ctaText || "");
    setCtaLink(item.ctaLink || "");
    setSlideOrder(item.slideOrder);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (item: HeroSlide) => {
    if (!item.id) return;
    if (!window.confirm(`Delete hero slide "${item.heading}"?`)) return;

    fetch(`/api/hero?id=${encodeURIComponent(item.id)}`, { method: "DELETE" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to delete");
        setItems((prev) => prev.filter((row) => row.id !== item.id));
      })
      .catch(() => {});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      heading,
      imageDataUrl,
      ctaText: ctaText || null,
      ctaLink: ctaLink || null,
      slideOrder,
    };

    const request = editId
      ? fetch("/api/hero", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...payload }),
        })
      : fetch("/api/hero", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    request
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to save");
        const saved = await r.json();
        setItems((prev) => {
          const next = editId
            ? prev.map((row) => (row.id === editId ? saved : row))
            : [...prev, saved];
          return next.sort((a, b) => a.slideOrder - b.slideOrder);
        });
        closeModal();
      })
      .catch(() => {})
      .finally(() => setSaving(false));
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Manage Hero</h1>
          <p className="text-slate-600 mt-2">
            Configure homepage hero slides, headings, and banner images.
          </p>
        </div>
        <button type="button" className="dash-btn-primary h-10 px-4 text-sm shrink-0" onClick={openCreate}>
          New Hero
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center" role="dialog" aria-modal="true">
          <form
            className="w-[95%] max-w-2xl grid gap-4 md:grid-cols-2 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 p-5"
            onSubmit={handleSubmit}
          >
            <div className="md:col-span-2 text-lg font-semibold">{editId ? "Edit Hero" : "New Hero"}</div>
            <div className="md:col-span-2">
              <label className="block text-xs mb-1">Banner image</label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
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
              {editId && (
                <p className="mt-1 text-xs text-slate-500">Leave empty to keep the current banner image.</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs mb-1">Heading</label>
              <input
                className="dash-input"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="Welcome to Federal College of Education..."
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1">CTA button text</label>
              <input
                className="dash-input"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Apply Now"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">CTA link</label>
              <input
                className="dash-input"
                type="text"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="/admission/application-form"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Slide order</label>
              <input
                className="dash-input"
                type="number"
                min={1}
                value={slideOrder}
                onChange={(e) => setSlideOrder(Math.max(1, Number(e.target.value) || 1))}
                required
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="dash-btn-secondary h-10 px-4 text-sm"
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="dash-btn-primary h-10 px-4 text-sm" disabled={saving}>
                {saving ? "Saving..." : editId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 dash-panel overflow-hidden">
        <div className="px-4 py-3 bg-black/5 dark:bg-white/10 font-semibold">All Hero Slides</div>
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading hero slides...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No hero slides yet. Click <span className="font-medium">New Hero</span> to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm dash-table">
              <thead className="bg-black/5 dark:bg-white/10 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-2">Order</th>
                  <th className="text-left px-4 py-2">Preview</th>
                  <th className="text-left px-4 py-2">Heading</th>
                  <th className="text-left px-4 py-2">CTA</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-black/[.06] dark:border-white/[.08]">
                    <td className="px-4 py-3 text-slate-600">{item.slideOrder}</td>
                    <td className="px-4 py-3">
                      <div className="w-24 h-14 rounded overflow-hidden ring-1 ring-black/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imageDataUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{item.heading}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.ctaText ? (
                        <>
                          <span className="font-medium text-slate-800">{item.ctaText}</span>
                          {item.ctaLink && (
                            <span className="block text-xs mt-0.5 truncate max-w-[200px]">{item.ctaLink}</span>
                          )}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="h-8 px-3 rounded border border-black/20 text-xs"
                          onClick={() => openEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="h-8 px-3 rounded bg-red-600 text-white text-xs"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
