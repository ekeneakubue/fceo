"use client";

import { useEffect, useState } from "react";

type ApplicantItem = {
  id: string;
  applicationNo: string;
  fullName: string;
  email: string;
  phone: string;
  schoolName?: string | null;
  programName?: string | null;
  programType?: string | null;
  status: string;
  submittedAt: string;
};

const STATUS_OPTIONS = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"] as const;

const statusClass = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-200";
    case "UNDER_REVIEW":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

export default function ApplicantsAdminPage() {
  const [items, setItems] = useState<ApplicantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadApplicants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/applicants", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setItems([]);
        setError(data?.error || "Failed to load applicants");
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
    loadApplicants();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    setError(null);
    try {
      const res = await fetch("/api/applicants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update status");
      setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status: data.status } : a)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Applicants</h1>
          <p className="text-slate-600 mt-2">Review and manage admission applications.</p>
        </div>
        <button className="dash-btn-secondary h-10 px-4 text-sm" onClick={loadApplicants} disabled={loading}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button type="button" onClick={loadApplicants} className="text-red-800 font-medium hover:underline">
            Retry
          </button>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="dash-table w-full text-sm">
            <thead>
              <tr>
                <th>Application No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>School</th>
                <th>Program</th>
                <th>Type</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    Loading applicants...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    No applicants yet.
                  </td>
                </tr>
              ) : (
                items.map((a) => (
                  <tr key={a.id} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-medium">{a.applicationNo}</td>
                    <td className="px-4 py-2">{a.fullName}</td>
                    <td className="px-4 py-2">{a.email}</td>
                    <td className="px-4 py-2">{a.phone}</td>
                    <td className="px-4 py-2">{a.schoolName || "—"}</td>
                    <td className="px-4 py-2">{a.programName || "—"}</td>
                    <td className="px-4 py-2">{a.programType || "—"}</td>
                    <td className="px-4 py-2">
                      <select
                        className={`text-xs rounded-md border px-2 py-1 ${statusClass(a.status)}`}
                        value={a.status}
                        disabled={updatingId === a.id}
                        onChange={(e) => updateStatus(a.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-slate-500">
                      {new Date(a.submittedAt).toLocaleDateString()}
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
