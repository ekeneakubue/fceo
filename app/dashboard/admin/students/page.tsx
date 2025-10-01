"use client";
import { useEffect, useState } from "react";
import SidebarAdmin from "../../../components/dashboard/SidebarAdmin";
import Topbar from "../../../components/dashboard/Topbar";

type Student = {
  regNo?: string;
  surname?: string;
  firstName?: string;
  middleName?: string;
  gender?: string;
  school?: string;
  programme?: string;
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [preview, setPreview] = useState<Student[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fceo.students");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setStudents(parsed);
      }
    } catch {}
  }, []);

  const persist = (next: Student[]) => {
    setStudents(next);
    try {
      localStorage.setItem("fceo.students", JSON.stringify(next));
    } catch {}
  };

  const handleCSVUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setError(null);
      const text = (reader.result as string) || "";
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length === 0) {
        setError("CSV appears empty.");
        return;
      }
      // Detect delimiter (comma, semicolon, or tab) and normalize BOM
      let header = lines[0].replace(/^\uFEFF/, "");
      const delimiter = header.includes("\t") ? "\t" : header.includes(";") ? ";" : ",";
      const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");
      const cols = header.split(delimiter).map((h) => norm(h));
      const idx = {
        regNo: cols.indexOf("regno"),
        surname: cols.indexOf("surname"),
        firstName: cols.indexOf("firstname"),
        middleName: cols.indexOf("middlename"),
        gender: cols.indexOf("gender"),
        school: cols.indexOf("school"),
        programme: cols.indexOf("programme"),
      };
      // Basic required columns
      if (idx.regNo < 0 || idx.programme < 0) {
        setError("CSV must include at least RegNo and Programme columns.");
        return;
      }
      const rows = lines.slice(1);
      const parsed: Student[] = rows.map((r) => {
        const c = r.split(delimiter);
        return {
          regNo: idx.regNo >= 0 ? c[idx.regNo]?.trim() : undefined,
          surname: idx.surname >= 0 ? c[idx.surname]?.trim() : undefined,
          firstName: idx.firstName >= 0 ? c[idx.firstName]?.trim() : undefined,
          middleName: idx.middleName >= 0 ? c[idx.middleName]?.trim() : undefined,
          gender: idx.gender >= 0 ? c[idx.gender]?.trim() : undefined,
          school: idx.school >= 0 ? c[idx.school]?.trim() : undefined,
          programme: idx.programme >= 0 ? c[idx.programme]?.trim() : undefined,
        };
      });
      setPreview(parsed);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <SidebarAdmin />
      <main className="px-0">
        <Topbar />
        <div className="px-6 py-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Students</h1>
              <p className="text-black/80 dark:text-white/80 mt-2">Manage students. Upload CSV with columns: RegNo, Surname, FirstName, MiddleName, Gender, School, Programme.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="h-10 px-4 rounded border border-black/20 text-sm bg-white/70 dark:bg-white/5"
                aria-label="Total students"
              >
                Total: {students.length}
              </button>
              <label className="h-10 grid items-center px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium cursor-pointer">
                Upload CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCSVUpload(file);
                    // Allow uploading the same file again by resetting input value
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="mt-3 text-sm text-red-600">{error}</div>
          )}

          <div className="mt-6 rounded-xl border border-black/[.08] dark:border-white/[.145] overflow-hidden bg-white/70 dark:bg-white/5">
            <div className="px-4 py-3 bg-black/5 dark:bg-white/10 font-semibold">All Students</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80">
                  <tr>
                    <th className="text-left px-4 py-2">RegNo</th>
                    <th className="text-left px-4 py-2">Surname</th>
                    <th className="text-left px-4 py-2">FirstName</th>
                    <th className="text-left px-4 py-2">MiddleName</th>
                    <th className="text-left px-4 py-2">Gender</th>
                    <th className="text-left px-4 py-2">School</th>
                    <th className="text-left px-4 py-2">Programme</th>
                    <th className="text-left px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/10">
                  {students.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4" colSpan={8}>No students yet. Use "Upload CSV" to populate.</td>
                    </tr>
                  ) : (
                    students.map((s, idx) => (
                      <tr key={(s.regNo || s.firstName || "stu") + "-" + idx} className="hover:bg-black/5 dark:hover:bg-white/10">
                        <td className="px-4 py-2">{s.regNo || "—"}</td>
                        <td className="px-4 py-2">{s.surname || "—"}</td>
                        <td className="px-4 py-2">{s.firstName || "—"}</td>
                        <td className="px-4 py-2">{s.middleName || "—"}</td>
                        <td className="px-4 py-2">{s.gender || "—"}</td>
                        <td className="px-4 py-2">{s.school || "—"}</td>
                        <td className="px-4 py-2">{s.programme || "—"}</td>
                        <td className="px-4 py-2">
                          <button
                            className="h-8 px-3 rounded bg-red-600 text-white text-xs"
                            onClick={() => {
                              const next = students.filter((_, i) => i !== idx);
                              persist(next);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {preview && (
            <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center" role="dialog" aria-modal="true">
              <div className="w-[95%] max-w-5xl rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="text-lg font-semibold">Preview import ({preview.length} rows)</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreview(null)}
                      className="h-9 px-3 rounded border border-black/20 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const key = (s: Student) => `${(s.regNo || "").toString().trim().toLowerCase()}|${(s.programme || "").toString().trim().toLowerCase()}`;
                        const existingKeys = new Set<string>(
                          students.map((s) => key(s))
                        );
                        const toAdd: Student[] = [];
                        for (const s of preview) {
                          const k = key(s);
                          // Skip if same RegNo already exists in the same Programme
                          if (s.regNo && s.programme && existingKeys.has(k)) {
                            continue;
                          }
                          if (s.regNo && s.programme) existingKeys.add(k);
                          toAdd.push(s);
                        }
                        const next = [...students, ...toAdd];
                        persist(next);
                        setPreview(null);
                      }}
                      className="h-9 px-3 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium"
                    >
                      Publish
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs md:text-sm">
                    <thead className="bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80">
                      <tr>
                        <th className="text-left px-3 py-2">RegNo</th>
                        <th className="text-left px-3 py-2">Surname</th>
                        <th className="text-left px-3 py-2">FirstName</th>
                        <th className="text-left px-3 py-2">MiddleName</th>
                        <th className="text-left px-3 py-2">Gender</th>
                        <th className="text-left px-3 py-2">School</th>
                        <th className="text-left px-3 py-2">Programme</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 dark:divide-white/10 max-h-[50vh] overflow-y-auto">
                      {preview.map((s, idx) => (
                        <tr key={(s.regNo || s.firstName || "row") + "-" + idx} className="hover:bg-black/5 dark:hover:bg-white/10">
                          <td className="px-3 py-2">{s.regNo || "—"}</td>
                          <td className="px-3 py-2">{s.surname || "—"}</td>
                          <td className="px-3 py-2">{s.firstName || "—"}</td>
                          <td className="px-3 py-2">{s.middleName || "—"}</td>
                          <td className="px-3 py-2">{s.gender || "—"}</td>
                          <td className="px-3 py-2">{s.school || "—"}</td>
                          <td className="px-3 py-2">{s.programme || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


