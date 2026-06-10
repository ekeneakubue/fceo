"use client";

import { useEffect, useState } from "react";

type SchoolItem = {
  id?: string;
  name: string;
  description?: string | null;
};

export default function SchoolsAdminPage() {
  const [items, setItems] = useState<SchoolItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSchools = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/schools", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setItems([]);
        setError(data?.error || "Failed to load schools");
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
    loadSchools();
  }, []);

  const resetForm = () => {
    setEditIndex(-1);
    setName("");
    setDescription("");
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Schools</h1>
          <p className="text-slate-600 mt-2">Manage academic schools in the database.</p>
        </div>
        <button
          className="dash-btn-primary h-10 px-4 text-sm"
          onClick={() => {
            resetForm();
            setShowAdd(true);
          }}
        >
          Add School
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button type="button" onClick={loadSchools} className="text-red-800 font-medium hover:underline">
            Retry
          </button>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center" role="dialog" aria-modal="true">
          <form
            className="w-[95%] max-w-2xl grid gap-4 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 p-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              setError(null);
              try {
                const payload = { name, description: description || null };
                const isEdit = editIndex >= 0 && items[editIndex]?.id;
                const res = await fetch("/api/schools", {
                  method: isEdit ? "PUT" : "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(isEdit ? { id: items[editIndex].id, ...payload } : payload),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Failed to save school");

                if (isEdit) {
                  setItems(items.map((s, i) => (i === editIndex ? data : s)));
                } else {
                  setItems([data, ...items]);
                }
                setShowAdd(false);
                resetForm();
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to save school");
              } finally {
                setSaving(false);
              }
            }}
          >
            <div className="text-lg font-semibold">{editIndex >= 0 ? "Edit School" : "Add School"}</div>
            <div>
              <label className="block text-xs mb-1">School name</label>
              <input
                className="dash-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. School of Education"
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Description (optional)</label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the school"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
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
        <div className="px-4 py-3 bg-black/5 dark:bg-white/10 font-semibold">All Schools</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm dash-table">
            <thead className="bg-black/5 dark:bg-white/10 text-slate-600">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Description</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-500" colSpan={3}>
                    Loading schools...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="px-4 py-4" colSpan={3}>
                    No schools yet. Click &quot;Add School&quot; to create one.
                  </td>
                </tr>
              ) : (
                items.map((s, idx) => (
                  <tr key={s.id || `${s.name}-${idx}`} className="hover:bg-black/5 dark:hover:bg-white/10">
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2 max-w-[480px]">
                      <div className="line-clamp-2">{s.description || "—"}</div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          className="h-8 px-3 rounded border border-black/20 text-xs"
                          onClick={() => {
                            setEditIndex(idx);
                            setName(s.name);
                            setDescription(s.description || "");
                            setShowAdd(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="h-8 px-3 rounded bg-red-600 text-white text-xs"
                          onClick={async () => {
                            if (!s.id) {
                              setItems(items.filter((_, i) => i !== idx));
                              return;
                            }
                            try {
                              const res = await fetch(`/api/schools?id=${encodeURIComponent(s.id)}`, {
                                method: "DELETE",
                              });
                              if (!res.ok) {
                                const data = await res.json();
                                throw new Error(data?.error || "Failed to delete");
                              }
                              setItems(items.filter((_, i) => i !== idx));
                            } catch (err: unknown) {
                              setError(err instanceof Error ? err.message : "Failed to delete school");
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
