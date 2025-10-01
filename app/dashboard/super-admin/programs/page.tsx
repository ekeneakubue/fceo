"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import Topbar from "../../../components/dashboard/Topbar";

type ProgramItem = {
  name: string;
  level: "NCE" | "Degree" | "Post-Graduate" | "Other";
  department?: string;
  description?: string;
};

export default function ProgramsAdminPage() {
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<ProgramItem["level"]>("NCE");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fceo.programs");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
  }, []);

  const persist = (next: ProgramItem[]) => {
    setItems(next);
    try {
      localStorage.setItem("fceo.programs", JSON.stringify(next));
    } catch {}
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <Sidebar />
      <main className="px-0">
        <Topbar />
        <div className="px-6 py-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Programs</h1>
              <p className="text-black/80 dark:text-white/80 mt-2">Manage academic programs.</p>
            </div>
            <button
              className="h-10 px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium"
              onClick={() => {
                setEditIndex(-1);
                setName("");
                setLevel("NCE");
                setDepartment("");
                setDescription("");
                setShowAdd(true);
              }}
            >
              Add program
            </button>
          </div>

          {showAdd && (
            <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center" role="dialog" aria-modal="true">
              <form
                className="w-[95%] max-w-2xl grid gap-4 md:grid-cols-2 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 p-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const item: ProgramItem = { name, level, department, description };
                  let next = [...items];
                  if (editIndex >= 0) next[editIndex] = item; else next = [...items, item];
                  persist(next);
                  setShowAdd(false);
                }}
              >
                <div className="md:col-span-2 text-lg font-semibold">{editIndex >= 0 ? "Edit program" : "Add program"}</div>
                <div>
                  <label className="block text-xs mb-1">Program name</label>
                  <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs mb-1">Level</label>
                  <select className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={level} onChange={(e) => setLevel(e.target.value as ProgramItem["level"]) }>
                    <option value="NCE">NCE</option>
                    <option value="Degree">Degree</option>
                    <option value="Post-Graduate">Post-Graduate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1">Department (optional)</label>
                  <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={department} onChange={(e) => setDepartment(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs mb-1">Description (optional)</label>
                  <textarea className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black min-h-[100px]" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="md:col-span-2 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setShowAdd(false)} className="h-10 px-4 rounded border border-black/20 text-sm">Cancel</button>
                  <button type="submit" className="h-10 px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium">Save</button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-black/[.08] dark:border-white/[.145] overflow-hidden bg-white/70 dark:bg-white/5">
            <div className="px-4 py-3 bg-black/5 dark:bg-white/10 font-semibold">All Programs</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80">
                  <tr>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Level</th>
                    <th className="text-left px-4 py-2">Department</th>
                    <th className="text-left px-4 py-2">Description</th>
                    <th className="text-left px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/10">
                  {items.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4" colSpan={5}>No programs yet. Click "Add program" to create one.</td>
                    </tr>
                  ) : (
                    items.map((p, idx) => (
                      <tr key={(p.name || "program") + "-" + idx} className="hover:bg-black/5 dark:hover:bg-white/10">
                        <td className="px-4 py-2">{p.name}</td>
                        <td className="px-4 py-2">{p.level}</td>
                        <td className="px-4 py-2">{p.department || "—"}</td>
                        <td className="px-4 py-2 max-w-[480px]"><div className="line-clamp-2">{p.description}</div></td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <button
                              className="h-8 px-3 rounded border border-black/20 text-xs"
                              onClick={() => {
                                setEditIndex(idx);
                                setName(p.name);
                                setLevel(p.level);
                                setDepartment(p.department || "");
                                setDescription(p.description || "");
                                setShowAdd(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="h-8 px-3 rounded bg-red-600 text-white text-xs"
                              onClick={() => {
                                const next = items.filter((_, i) => i !== idx);
                                persist(next);
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
        </div>
      </main>
    </div>
  );
}


