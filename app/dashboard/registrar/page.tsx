"use client";

import { useEffect, useState } from "react";
import { QuickActionCard, StatCard, WelcomeBanner } from "../../components/dashboard/DashboardUI";

type ApplicantSummary = {
  status: string;
};

export default function RegistrarDashboard() {
  const [applicants, setApplicants] = useState<ApplicantSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/applicants", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setApplicants(data);
        }
      } catch {
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pending = applicants.filter((a) => a.status === "PENDING").length;
  const underReview = applicants.filter((a) => a.status === "UNDER_REVIEW").length;
  const approved = applicants.filter((a) => a.status === "APPROVED").length;
  const rejected = applicants.filter((a) => a.status === "REJECTED").length;

  return (
    <>
      <WelcomeBanner
        badge="Registrar"
        title="Welcome to the Registrar Portal"
        subtitle="Review admission applications and manage your registrar profile."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          label="Total Applicants"
          value={loading ? "—" : String(applicants.length)}
          hint="All submitted applications"
          icon="applicants"
        />
        <StatCard
          label="Pending"
          value={loading ? "—" : String(pending)}
          hint="Awaiting review"
          icon="users"
          accent="amber"
        />
        <StatCard
          label="Under Review"
          value={loading ? "—" : String(underReview)}
          hint="Currently being processed"
          icon="widgets"
          accent="blue"
        />
        <StatCard
          label="Approved"
          value={loading ? "—" : String(approved)}
          hint={`${rejected} rejected`}
          icon="shield"
          accent="violet"
        />
      </div>

      <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          title="Review Applicants"
          description="View and update admission application status."
          href="/dashboard/registrar/applicants"
          icon="applicants"
        />
        <QuickActionCard
          title="Account Settings"
          description="Update your profile and preferences."
          href="/dashboard/registrar/settings"
          icon="settings"
        />
      </div>
    </>
  );
}
