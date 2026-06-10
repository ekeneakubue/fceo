"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NavIcon } from "./icons";
import { NAV_CONFIG, type DashboardRole } from "./nav-config";

type DashboardSidebarProps = {
  role: DashboardRole;
  mobileOpen?: boolean;
  onNavigate?: () => void;
};

function StudentHeader() {
  const [displayName, setDisplayName] = useState("Student");
  const [avatarSrc, setAvatarSrc] = useState("/images/fceo-logo.jpg");

  useEffect(() => {
    (async () => {
      try {
        let regKey = "";
        const raw = localStorage.getItem("fceo.currentUser");
        if (raw) {
          const u = JSON.parse(raw);
          regKey = (u?.regNo || "").toString().trim().toLowerCase();
          setDisplayName(u?.fullName || u?.email || u?.regNo || "Student");
          if (u?.avatarDataUrl) setAvatarSrc(u.avatarDataUrl);
        }
        if (!regKey) return;
        const list = await fetch("/api/students", { cache: "no-store" }).then((r) => r.json());
        if (!Array.isArray(list)) return;
        const row = list.find((s: { regNo?: string }) => (s?.regNo || "").toString().trim().toLowerCase() === regKey);
        if (!row) return;
        const nameParts = [row?.firstName, row?.middleName, row?.surname].filter(Boolean);
        if (nameParts.length) setDisplayName(nameParts.join(" "));
        if (row?.avatarDataUrl) setAvatarSrc(row.avatarDataUrl);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const handleProfileUpdated = (e: Event) => {
      try {
        const ce = e as CustomEvent;
        const updated = (ce.detail as { updated?: { fullName?: string; email?: string; regNo?: string; avatarDataUrl?: string } })?.updated;
        if (updated) {
          setDisplayName(updated.fullName || updated.email || updated.regNo || "Student");
          if (updated.avatarDataUrl) setAvatarSrc(updated.avatarDataUrl);
        }
      } catch {}
    };
    window.addEventListener("fceo:profile-updated", handleProfileUpdated as EventListener);
    return () => window.removeEventListener("fceo:profile-updated", handleProfileUpdated as EventListener);
  }, []);

  return (
    <div className="flex items-center gap-3 px-1 pb-4 mb-2 border-b border-white/15">
      <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/30 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate">{displayName}</p>
        <p className="text-xs text-white/70">Student Portal</p>
      </div>
    </div>
  );
}

function NavLinks({
  role,
  onNavigate,
}: {
  role: DashboardRole;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const config = NAV_CONFIG[role];
  const mainItems = config.items.filter((i) => !i.footer);
  const footerItems = config.items.filter((i) => i.footer);

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
      active
        ? "bg-white/20 text-white shadow-sm border-l-[3px] border-white pl-[9px]"
        : "text-white/85 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      <nav className="flex flex-col gap-0.5 flex-1">
        {mainItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate} className={linkClass(active)}>
              <NavIcon name={item.icon} className="w-5 h-5 shrink-0 opacity-90" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {footerItems.length > 0 && (
        <div className="mt-auto pt-3 border-t border-white/15">
          {footerItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={onNavigate} className={linkClass(active)}>
                <NavIcon name={item.icon} className="w-5 h-5 shrink-0 opacity-90" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

function SidebarInner({ role, onNavigate }: { role: DashboardRole; onNavigate?: () => void }) {
  const config = NAV_CONFIG[role];

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center gap-3 px-1 mb-5">
        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30 bg-white shrink-0">
          <Image src="/images/fceo-logo.jpg" alt="FCEO" fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight truncate">{config.title}</p>
          <p className="text-xs text-white/70">{config.subtitle}</p>
        </div>
      </div>

      {role === "student" && <StudentHeader />}
      <NavLinks role={role} onNavigate={onNavigate} />
    </div>
  );
}

export default function DashboardSidebar({ role, mobileOpen, onNavigate }: DashboardSidebarProps) {
  const sidebarClass =
    "dash-sidebar flex flex-col h-full bg-gradient-to-b from-brand-green via-brand-green-dark to-[#024a0f] text-white shadow-xl";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`${sidebarClass} hidden md:flex w-64 shrink-0 sticky top-0 h-screen`}>
        <SidebarInner role={role} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={onNavigate}
          />
          <aside className={`${sidebarClass} absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] animate-in slide-in-from-left duration-200`}>
            <SidebarInner role={role} onNavigate={onNavigate} />
          </aside>
        </div>
      )}
    </>
  );
}
