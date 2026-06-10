"use client";

import { usePathname } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";
import { detectDashboardRole } from "./nav-config";

export default function Sidebar() {
  const role = detectDashboardRole(usePathname() || "");
  return <DashboardSidebar role={role} />;
}
