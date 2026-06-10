"use client";

import { useEffect, useState } from "react";

type ApplicantItem = {
  id: string;
  applicationNo: string;
  avatarDataUrl?: string | null;
  fullName: string;
  surname: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: string | null;
  dateOfBirth?: string | null;
  maritalStatus?: string | null;
  address?: string | null;
  countryOfOrigin?: string | null;
  stateOfOrigin?: string | null;
  localGovernmentOfOrigin?: string | null;
  homeTown?: string | null;
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

function ApplicantAvatar({
  src,
  name,
  size = "md",
}: {
  src?: string | null;
  name: string;
  size?: "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const sizeClass = size === "lg" ? "w-16 h-16 text-sm" : "w-10 h-10 text-xs";

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} className={`${sizeClass} rounded-full object-cover ring-2 ring-slate-100`} />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-brand-green/10 text-brand-green font-semibold grid place-items-center ring-2 ring-slate-100`}
    >
      {initials || "?"}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-900 mt-0.5">{value?.trim() || "—"}</dd>
    </div>
  );
}

export default function RegistrarApplicantsPage() {
  const [items, setItems] = useState<ApplicantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ApplicantItem | null>(null);
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
      setSelected((prev) => (prev?.id === id ? { ...prev, status: data.status } : prev));
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
          <p className="text-slate-600 mt-2">Review admission applications submitted to the college.</p>
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
                <th>Avatar</th>
                <th>Name</th>
                <th>School</th>
                <th>Program</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Loading applicants...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No applicants yet.
                  </td>
                </tr>
              ) : (
                items.map((a) => (
                  <tr key={a.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <ApplicantAvatar src={a.avatarDataUrl} name={a.fullName} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{a.fullName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{a.applicationNo}</p>
                    </td>
                    <td className="px-4 py-3">{a.schoolName || "—"}</td>
                    <td className="px-4 py-3">
                      <p>{a.programName || "—"}</p>
                      {a.programType && (
                        <p className="text-xs text-slate-500 mt-0.5">{a.programType}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelected(a)}
                        className="dash-btn-secondary h-9 px-3 text-xs"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="applicant-details-title"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-4">
                <ApplicantAvatar src={selected.avatarDataUrl} name={selected.fullName} size="lg" />
                <div>
                  <h2 id="applicant-details-title" className="text-lg font-semibold text-slate-900">
                    {selected.fullName}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">{selected.applicationNo}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Application Status
                </h3>
                <select
                  className={`text-sm rounded-md border px-3 py-2 ${statusClass(selected.status)}`}
                  value={selected.status}
                  disabled={updatingId === selected.id}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Program</h3>
                <dl className="grid sm:grid-cols-2 gap-4">
                  <DetailRow label="School" value={selected.schoolName} />
                  <DetailRow label="Program Type" value={selected.programType} />
                  <DetailRow label="Programme" value={selected.programName} />
                  <DetailRow
                    label="Submitted"
                    value={new Date(selected.submittedAt).toLocaleDateString()}
                  />
                </dl>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Personal Information
                </h3>
                <dl className="grid sm:grid-cols-2 gap-4">
                  <DetailRow label="Email" value={selected.email} />
                  <DetailRow label="Phone" value={selected.phone} />
                  <DetailRow label="Gender" value={selected.gender} />
                  <DetailRow label="Date of Birth" value={selected.dateOfBirth} />
                  <DetailRow label="Marital Status" value={selected.maritalStatus} />
                  <DetailRow label="Home Town" value={selected.homeTown} />
                  <DetailRow label="Address" value={selected.address} />
                  <DetailRow label="Country of Origin" value={selected.countryOfOrigin} />
                  <DetailRow label="State of Origin" value={selected.stateOfOrigin} />
                  <DetailRow label="Local Government" value={selected.localGovernmentOfOrigin} />
                </dl>
              </div>
            </div>

            <div className="border-t border-slate-200 px-5 py-4 flex justify-end">
              <button type="button" onClick={() => setSelected(null)} className="dash-btn-secondary h-10 px-4 text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
