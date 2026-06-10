"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import Topbar from "./Topbar";
import { detectDashboardRole } from "./nav-config";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role = detectDashboardRole(pathname || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <DashboardSidebar
        role={role}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 dash-content">{children}</main>
      </div>
    </div>
  );
}
