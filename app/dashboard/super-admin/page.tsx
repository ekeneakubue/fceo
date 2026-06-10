"use client";

import { useEffect } from "react";
import { QuickActionCard, StatCard, WelcomeBanner } from "../../components/dashboard/DashboardUI";

export default function SuperAdminDashboard() {
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const already = localStorage.getItem("fceo.synced");
      if (already) return;
      const users = JSON.parse(localStorage.getItem("fceo.users") || "null") || [];
      const students = JSON.parse(localStorage.getItem("fceo.students") || "null") || [];
      const news = JSON.parse(localStorage.getItem("fceo.news") || "null") || [];
      const gallery = JSON.parse(localStorage.getItem("fceo.gallery") || "null") || [];
      fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users, students, news, gallery }),
      }).finally(() => localStorage.setItem("fceo.synced", "1"));
    } catch {}
  }, []);

  return (
    <>
      <WelcomeBanner
        badge="Super Admin"
        title="Welcome back to FCEO Admin"
        subtitle="Manage users, academic programs, content, and system configuration from one central hub."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="User Roles" value="11" hint="Including Director, Dean, HoD" icon="users" />
        <StatCard label="Modules" value="10" hint="Active admin sections" icon="widgets" accent="blue" />
        <StatCard label="Content" value="News & Gallery" hint="Publish campus updates" icon="news" accent="amber" />
        <StatCard label="Academics" value="Programs" hint="Courses & timetables" icon="programs" accent="violet" />
      </div>

      <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard title="Manage Users" description="Add, edit, and assign roles to staff." href="/dashboard/super-admin/users" icon="users" />
        <QuickActionCard title="Students" description="View and manage student records." href="/dashboard/super-admin/students" icon="students" />
        <QuickActionCard title="Roles & Permissions" description="Define access policies for each role." href="/dashboard/super-admin/roles" icon="shield" />
        <QuickActionCard title="Dashboard Widgets" description="Configure role-scoped dashboard cards." href="/dashboard/super-admin/widgets" icon="widgets" />
        <QuickActionCard title="News & Gallery" description="Publish news and campus photos." href="/dashboard/super-admin/news" icon="news" />
        <QuickActionCard title="System Settings" description="Update your profile and preferences." href="/dashboard/super-admin/settings" icon="settings" />
      </div>
    </>
  );
}
