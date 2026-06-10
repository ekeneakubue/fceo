"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NavIcon } from "./icons";
import { detectDashboardRole, getPageTitle } from "./nav-config";

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const role = detectDashboardRole(pathname || "");
  const pageTitle = getPageTitle(pathname || "", role);
  const [name, setName] = useState("User");
  const [avatarSrc, setAvatarSrc] = useState("/images/fceo-logo.jpg");
  const isStudent = role === "student";

  const handleLogout = () => {
    try {
      const raw = localStorage.getItem("fceo.currentUser");
      let userRole = "";
      if (raw) {
        const u = JSON.parse(raw);
        userRole = String(u?.roleKey || u?.roleLabel || "").toUpperCase();
      }
      localStorage.removeItem("fceo.currentUser");
      router.push(userRole.includes("STUDENT") ? "/student-login" : "/staff-login");
    } catch {
      router.push("/staff-login");
    }
  };

  useEffect(() => {
    type StoredUser = {
      email?: string;
      regNo?: string;
      fullName?: string;
      avatarDataUrl?: string;
    };

    const matchUser = (list: StoredUser[], email: string | null, regNo: string | null) => {
      if (!Array.isArray(list) || list.length === 0) return null;
      if (email) {
        const byEmail = list.find((u) => (u?.email || "").toString().trim().toLowerCase() === email);
        if (byEmail) return byEmail;
      }
      if (regNo) {
        const byReg = list.find((u) => (u?.regNo || "").toString().trim().toLowerCase() === regNo);
        if (byReg) return byReg;
      }
      return null;
    };

    const applyUser = (user: StoredUser | null) => {
      if (!user) return;
      const display = user.fullName || user.email || "User";
      const avatar = user.avatarDataUrl || "/images/fceo-logo.jpg";
      setName(display);
      setAvatarSrc(avatar);
    };

    const loadCurrentUser = async () => {
      try {
        let identEmail: string | null = null;
        let identRegNo: string | null = null;
        let localUser: StoredUser | null = null;

        const rawCurrent = localStorage.getItem("fceo.currentUser");
        if (rawCurrent) {
          const parsed = JSON.parse(rawCurrent) as StoredUser;
          localUser = parsed;
          identEmail = (parsed?.email || "").toString().trim().toLowerCase() || null;
          identRegNo = (parsed?.regNo || "").toString().trim().toLowerCase() || null;
          applyUser(parsed);
        }

        const usersRes = await fetch("/api/users", { cache: "no-store" });

        let dbUser: StoredUser | null = null;
        if (usersRes.ok) {
          const users = await usersRes.json();
          dbUser = matchUser(users, identEmail, identRegNo);
        }

        const resolved = {
          ...localUser,
          ...dbUser,
          fullName: dbUser?.fullName || localUser?.fullName,
          avatarDataUrl: dbUser?.avatarDataUrl || localUser?.avatarDataUrl,
        };

        if (resolved.email || resolved.fullName) {
          applyUser(resolved);
        }
      } catch {}
    };

    loadCurrentUser();

    const handleUserUpdated = (e: Event) => {
      const updated = (e as CustomEvent).detail?.user as StoredUser | undefined;
      if (updated) applyUser(updated);
      else loadCurrentUser();
    };
    window.addEventListener("fceo:user-updated", handleUserUpdated as EventListener);
    return () => window.removeEventListener("fceo:user-updated", handleUserUpdated as EventListener);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 md:px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <NavIcon name="menu" className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-medium text-brand-green uppercase tracking-wider hidden sm:block">Dashboard</p>
          <h1 className="text-base md:text-lg font-semibold text-slate-900 truncate">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {!isStudent && (
          <div className="hidden sm:flex items-center gap-2.5 pr-2 border-r border-slate-200">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-brand-green/20">
              {avatarSrc.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
              ) : (
                <Image src={avatarSrc} alt="" fill className="object-cover" unoptimized />
              )}
            </div>
            <span className="text-sm font-medium text-slate-700 max-w-[140px] truncate">{name}</span>
          </div>
        )}
        <button type="button" onClick={handleLogout} className="dash-btn-secondary text-sm px-3 py-2 h-9">
          Logout
        </button>
      </div>
    </header>
  );
}
