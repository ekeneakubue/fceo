"use client";

import { useEffect, useState } from "react";
import { StatCard } from "../../../components/dashboard/DashboardUI";

type SchoolOption = {
  id: string;
  name: string;
};

type ProgramTypeLabel = "NCE" | "Degree" | "Post-Graduate";

type ProgramItem = {
  id?: string;
  name: string;
  programType?: ProgramTypeLabel;
  programTypeName?: ProgramTypeLabel;
  level?: ProgramTypeLabel;
  schoolId?: string | null;
  schoolName?: string | null;
  description?: string;
};

export default function ProgramsAdminPage() {
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [name, setName] = useState("");
  const [programType, setProgramType] = useState<ProgramTypeLabel>("NCE");
  const [schoolId, setSchoolId] = useState("");
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/programs", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setItems([]);
        setError(data?.error || "Failed to load programs");
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

  const loadSchools = async () => {
    try {
      const res = await fetch("/api/schools", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setSchools(data);
      }
    } catch {}
  };

  useEffect(() => {
    loadPrograms();
    loadSchools();
  }, []);

  const resetForm = () => {
    setEditIndex(-1);
    setName("");
    setProgramType("NCE");
    setSchoolId("");
    setDescription("");
  };

  const programTypeLabel = (p: ProgramItem) => p.programTypeName || p.programType || p.level || "—";

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Programs</h1>
          <p className="text-slate-600 mt-2">Manage academic programs in the database.</p>
        </div>
        <button
          className="dash-btn-primary h-10 px-4 text-sm"
          onClick={() => {
            resetForm();
            setShowAdd(true);
          }}
        >
          Add program
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Programs"
          value={loading ? "—" : items.length}
          hint="All academic programs in the database"
          icon="programs"
          accent="violet"
        />
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button type="button" onClick={loadPrograms} className="text-red-800 font-medium hover:underline">
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
              setSaving(true);
              setError(null);
              try {
                const payload = { name, programType, schoolId, description: description || null };
                const isEdit = editIndex >= 0 && items[editIndex]?.id;
                const res = await fetch("/api/programs", {
                  method: isEdit ? "PUT" : "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(isEdit ? { id: items[editIndex].id, ...payload } : payload),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Failed to save program");

                if (isEdit) {
                  setItems(items.map((p, i) => (i === editIndex ? data : p)));
                } else {
                  setItems([data, ...items]);
                }
                setShowAdd(false);
                resetForm();
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to save program");
              } finally {
                setSaving(false);
              }
            }}
          >
            <div className="md:col-span-2 text-lg font-semibold">
              {editIndex >= 0 ? "Edit program" : "Add program"}
            </div>
            <div>
              <label className="block text-xs mb-1">Program name</label>
              <input className="dash-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs mb-1">Program Type</label>
              <select
                className="dash-input"
                value={programType}
                onChange={(e) => setProgramType(e.target.value as ProgramTypeLabel)}
              >
                <option value="NCE">NCE</option>
                <option value="Degree">Degree</option>
                <option value="Post-Graduate">Post-Graduate</option>
              </select>
            </div>
            <div className="col-span-full">
              <label className="block text-xs mb-1">School</label>
              <select
                className="dash-input w-full"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                required
              >
                <option value="">Select school</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs mb-1">Description (optional)</label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
        <div className="px-4 py-3 bg-black/5 dark:bg-white/10 font-semibold">All Programs</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm dash-table">
            <thead className="bg-black/5 dark:bg-white/10 text-slate-600">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Program Type</th>
                <th className="text-left px-4 py-2">School</th>
                <th className="text-left px-4 py-2">Description</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                    Loading programs...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="px-4 py-4" colSpan={5}>
                    No programs yet. Click &quot;Add program&quot; to create one.
                  </td>
                </tr>
              ) : (
                items.map((p, idx) => (
                  <tr key={p.id || `${p.name}-${idx}`} className="hover:bg-black/5 dark:hover:bg-white/10">
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{programTypeLabel(p)}</td>
                    <td className="px-4 py-2">{p.schoolName || "—"}</td>
                    <td className="px-4 py-2 max-w-[480px]">
                      <div className="line-clamp-2">{p.description}</div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          className="h-8 px-3 rounded border border-black/20 text-xs"
                          onClick={() => {
                            setEditIndex(idx);
                            setName(p.name);
                            setProgramType(programTypeLabel(p) as ProgramTypeLabel);
                            setSchoolId(p.schoolId || "");
                            setDescription(p.description || "");
                            setShowAdd(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="h-8 px-3 rounded bg-red-600 text-white text-xs"
                          onClick={async () => {
                            if (!p.id) {
                              setItems(items.filter((_, i) => i !== idx));
                              return;
                            }
                            try {
                              const res = await fetch(`/api/programs?id=${encodeURIComponent(p.id)}`, {
                                method: "DELETE",
                              });
                              if (!res.ok) {
                                const data = await res.json();
                                throw new Error(data?.error || "Failed to delete");
                              }
                              setItems(items.filter((_, i) => i !== idx));
                            } catch (err: unknown) {
                              setError(err instanceof Error ? err.message : "Failed to delete program");
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
