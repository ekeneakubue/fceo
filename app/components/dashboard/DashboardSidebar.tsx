"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NavIcon } from "./icons";
import { NAV_CONFIG, type DashboardRole, type NavItem } from "./nav-config";

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

function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.href && pathname === item.href) return true;
  return item.children?.some((child) => pathname === child.href) ?? false;
}

function NavFlyoutItem({
  item,
  pathname,
  onNavigate,
  linkClass,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
  linkClass: (active: boolean) => string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = isNavItemActive(item, pathname);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${linkClass(active)} w-full justify-between`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="flex items-center gap-3 min-w-0">
          <NavIcon name={item.icon} className="w-5 h-5 shrink-0 opacity-90" />
          <span className="truncate">{item.label}</span>
        </span>
        <NavIcon name="chevron-right" className="w-4 h-4 shrink-0 opacity-70" />
      </button>

      {open && item.children && (
        <div className="absolute left-full top-0 z-[100] pl-2" role="presentation">
          <div
            className="w-56 rounded-xl border border-white/20 bg-gradient-to-b from-brand-green via-brand-green-dark to-[#024a0f] text-white shadow-2xl shadow-black/40 py-2 scale-100 origin-left animate-in fade-in zoom-in-95 slide-in-from-left-2 duration-150"
            role="menu"
          >
            <p className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/50">
              {item.label}
            </p>
            {item.children.map((child) => {
              const childActive = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className={`flex items-center gap-3 mx-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    childActive
                      ? "bg-white/20 text-white shadow-sm border-l-[3px] border-white pl-[9px]"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <NavIcon name={child.icon} className="w-4 h-4 shrink-0 opacity-90" />
                  <span>{child.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
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
      <nav className="flex flex-col gap-0.5 flex-1 overflow-visible">
        {mainItems.map((item) => {
          if (item.children?.length) {
            return (
              <NavFlyoutItem
                key={item.label}
                item={item}
                pathname={pathname}
                onNavigate={onNavigate}
                linkClass={linkClass}
              />
            );
          }

          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href!} onClick={onNavigate} className={linkClass(active)}>
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
              <Link key={item.href} href={item.href!} onClick={onNavigate} className={linkClass(active)}>
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
    <div className="flex flex-col h-full p-4 overflow-visible">
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
      <aside className={`${sidebarClass} hidden md:flex w-64 shrink-0 sticky top-0 h-screen overflow-visible z-40`}>
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
          <aside className={`${sidebarClass} absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] overflow-visible animate-in slide-in-from-left duration-200`}>
            <SidebarInner role={role} onNavigate={onNavigate} />
          </aside>
        </div>
      )}
    </>
  );
}
