"use client";

import { useEffect, useRef, useState } from "react";

type LeadershipItem = {
  id?: string;
  imageDataUrl: string;
  fullName: string;
  profile?: string | null;
  officeTitle: string;
  sortOrder: number;
};

export default function LeadershipAdminPage() {
  const [items, setItems] = useState<LeadershipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const [imageDataUrl, setImageDataUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [profile, setProfile] = useState("");
  const [officeTitle, setOfficeTitle] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leadership", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setItems([]);
        setError(data?.error || "Failed to load leadership");
        return;
      }
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = (nextOrder?: number) => {
    setEditIndex(-1);
    setImageDataUrl("");
    setFullName("");
    setProfile("");
    setOfficeTitle("");
    setSortOrder(nextOrder ?? items.length + 1);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Leadership</h1>
          <p className="text-slate-600 mt-2">Manage college principal officers shown on the public Leadership page.</p>
        </div>
        <button
          type="button"
          className="dash-btn-primary h-10 px-4 text-sm shrink-0"
          onClick={() => {
            resetForm(items.length + 1);
            setShowAdd(true);
          }}
        >
          Add Leadership
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button type="button" onClick={loadItems} className="text-red-800 font-medium hover:underline">
            Retry
          </button>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center" role="dialog" aria-modal="true">
          <form
            className="w-[95%] max-w-2xl grid gap-4 md:grid-cols-2 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 p-5"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!imageDataUrl) {
                setError("Photo is required");
                return;
              }
              setSaving(true);
              setError(null);
              try {
                const payload = {
                  imageDataUrl,
                  fullName,
                  profile: profile || null,
                  officeTitle,
                  sortOrder,
                };
                const isEdit = editIndex >= 0 && items[editIndex]?.id;
                const res = await fetch("/api/leadership", {
                  method: isEdit ? "PUT" : "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(isEdit ? { id: items[editIndex].id, ...payload } : payload),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Failed to save leadership");

                setItems((prev) => {
                  const next = isEdit
                    ? prev.map((row, i) => (i === editIndex ? data : row))
                    : [...prev, data];
                  return next.sort((a, b) => a.sortOrder - b.sortOrder);
                });
                setShowAdd(false);
                resetForm();
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to save leadership");
              } finally {
                setSaving(false);
              }
            }}
          >
            <div className="md:col-span-2 text-lg font-semibold">
              {editIndex >= 0 ? "Edit Leadership" : "Add Leadership"}
            </div>
            <div className="md:col-span-2 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="relative w-24 h-24 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 hover:border-[rgb(3,158,29)] hover:bg-[rgb(3,158,29)]/5 transition overflow-hidden group"
                aria-label="Upload photo"
              >
                {imageDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageDataUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-slate-400 group-hover:text-[rgb(3,158,29)]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                      <path
                        fillRule="evenodd"
                        d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
                {imageDataUrl && (
                  <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                      <path
                        fillRule="evenodd"
                        d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setImageDataUrl(reader.result as string);
                  reader.readAsDataURL(file);
                  e.currentTarget.value = "";
                }}
              />
              <p className="text-xs text-slate-500">Upload photo</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs mb-1">Full name</label>
              <input
                className="dash-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Jane Doe"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs mb-1">Profile / Credentials (optional)</label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                placeholder="e.g. Ph.D(English), MA, BA, NCE"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Office / Title</label>
              <input
                className="dash-input"
                value={officeTitle}
                onChange={(e) => setOfficeTitle(e.target.value)}
                placeholder="e.g. Provost"
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Display order</label>
              <input
                className="dash-input"
                type="number"
                min={1}
                value={sortOrder}
                onChange={(e) => setSortOrder(Math.max(1, Number(e.target.value) || 1))}
                required
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="dash-btn-secondary h-10 px-4 text-sm"
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="dash-btn-primary h-10 px-4 text-sm" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 dash-panel overflow-hidden">
        <div className="px-4 py-3 bg-black/5 dark:bg-white/10 font-semibold">Principal Officers</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm dash-table">
            <thead className="bg-black/5 dark:bg-white/10 text-slate-600">
              <tr>
                <th className="text-left px-4 py-2">Order</th>
                <th className="text-left px-4 py-2">Photo</th>
                <th className="text-left px-4 py-2">Full Name</th>
                <th className="text-left px-4 py-2">Office</th>
                <th className="text-left px-4 py-2">Profile</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-500" colSpan={6}>
                    Loading leadership...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="px-4 py-4" colSpan={6}>
                    No leadership entries yet. Click &quot;Add Leadership&quot; to create one.
                  </td>
                </tr>
              ) : (
                items.map((leader, idx) => (
                  <tr key={leader.id || `${leader.officeTitle}-${idx}`} className="hover:bg-black/5 dark:hover:bg-white/10">
                    <td className="px-4 py-2 text-slate-600">{leader.sortOrder}</td>
                    <td className="px-4 py-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-black/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={leader.imageDataUrl}
                          alt={leader.fullName || leader.officeTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium">{leader.fullName || "—"}</td>
                    <td className="px-4 py-2">{leader.officeTitle}</td>
                    <td className="px-4 py-2 text-slate-600 max-w-[360px]">
                      <div className="line-clamp-2">{leader.profile || "—"}</div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="h-8 px-3 rounded border border-black/20 text-xs"
                          onClick={() => {
                            setEditIndex(idx);
                            setImageDataUrl(leader.imageDataUrl);
                            setFullName(leader.fullName || "");
                            setProfile(leader.profile || "");
                            setOfficeTitle(leader.officeTitle);
                            setSortOrder(leader.sortOrder);
                            setShowAdd(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="h-8 px-3 rounded bg-red-600 text-white text-xs"
                          onClick={async () => {
                            if (!leader.id) {
                              setItems(items.filter((_, i) => i !== idx));
                              return;
                            }
                            try {
                              const res = await fetch(`/api/leadership?id=${encodeURIComponent(leader.id)}`, {
                                method: "DELETE",
                              });
                              if (!res.ok) {
                                const data = await res.json();
                                throw new Error(data?.error || "Failed to delete");
                              }
                              setItems(items.filter((_, i) => i !== idx));
                            } catch (err: unknown) {
                              setError(err instanceof Error ? err.message : "Failed to delete leadership");
                            }
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
    </>
  );
}
