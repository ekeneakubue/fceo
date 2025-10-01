"use client";
import { useEffect } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

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
      }).finally(() => {
        localStorage.setItem("fceo.synced", "1");
      });
    } catch {}
  }, []);
  const widgets = [
    { title: "Manage Users", href: "#" },
    { title: "Roles & Permissions", href: "#" },
    { title: "Dashboard Widgets", href: "#" },
    { title: "System Settings", href: "#" },
  ];
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <Sidebar />
      <main className="px-0">
        <Topbar />
        <div className="px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-semibold">Super Admin Dashboard</h1>
        <p className="text-black/80 dark:text-white/80 mt-2">High-level controls and configuration.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {widgets.map((w) => (
            <a key={w.title} href={w.href} className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 bg-white/70 dark:bg-white/5 hover:bg-white">
              <div className="text-2xl">⚙️</div>
              <h3 className="mt-2 font-semibold">{w.title}</h3>
              <p className="text-sm text-black/70 dark:text-white/70 mt-1">Go to {w.title}</p>
            </a>
          ))}
        </div>
        </div>
      </main>
    </div>
  );
}


