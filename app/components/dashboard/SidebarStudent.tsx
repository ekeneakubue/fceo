"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const items = [
  { label: "Overview", href: "/dashboard/student" },
  { label: "Profile", href: "/dashboard/student/profile" },
  { label: "Fees", href: "/dashboard/student/fees" },
  { label: "Courses", href: "/dashboard/student/courses" },
  { label: "Books", href: "/dashboard/student/books" },
  { label: "Hostel", href: "/dashboard/student/hostel" },
  { label: "User Settings", href: "/dashboard/student/settings" },
];

export default function SidebarStudent() {
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState<string>("Student");
  const [avatarSrc, setAvatarSrc] = useState<string>("/images/fceo-logo.jpg");

  useEffect(() => {
    (async () => {
      try {
        // Seed defaults from local storage
        let regKey = "";
        try {
          const raw = localStorage.getItem("fceo.currentUser");
          if (raw) {
            const u = JSON.parse(raw);
            regKey = (u?.regNo || "").toString().trim().toLowerCase();
            const seedName = u?.fullName || u?.email || u?.regNo || "Student";
            const seedAvatar = u?.avatarDataUrl || "/images/fceo-logo.jpg";
            setDisplayName(seedName);
            setAvatarSrc(seedAvatar);
          }
        } catch {}

        if (!regKey) return;

        // Prefer DB record for canonical name/avatar
        try {
          const list = await fetch("/api/students", { cache: "no-store" }).then((r) => r.json());
          if (Array.isArray(list)) {
            const row = list.find((s: any) => (s?.regNo || "").toString().trim().toLowerCase() === regKey);
            if (row) {
              const nameParts = [row?.firstName, row?.middleName, row?.surname].filter(Boolean);
              const pretty = nameParts.length ? nameParts.join(" ") : (row?.email || row?.regNo || "Student");
              setDisplayName(pretty);
              if (row?.avatarDataUrl) setAvatarSrc(row.avatarDataUrl);
            }
          }
        } catch {}
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const handleProfileUpdated = (e: Event) => {
      try {
        const ce = e as CustomEvent;
        const updated = (ce.detail as any)?.updated || null;
        if (updated) {
          const name = updated.fullName || updated.email || updated.regNo || "Student";
          setDisplayName(name);
          if (updated.avatarDataUrl) setAvatarSrc(updated.avatarDataUrl);
        } else {
          const raw = localStorage.getItem("fceo.currentUser");
          if (raw) {
            const u = JSON.parse(raw);
            const name2 = u?.fullName || u?.email || u?.regNo || "Student";
            setDisplayName(name2);
            if (u?.avatarDataUrl) setAvatarSrc(u.avatarDataUrl);
          }
        }
      } catch {}
    };
    window.addEventListener("fceo:profile-updated", handleProfileUpdated as EventListener);
    return () => window.removeEventListener("fceo:profile-updated", handleProfileUpdated as EventListener);
  }, []);
  return (
    <aside className="h-screen sticky top-0 w-64 bg-white/90 dark:bg-black/30 border-r border-black/[.08] dark:border-white/[.14] p-4 hidden md:flex md:flex-col">
      <div className="grid place-items-center gap-3 mb-4">
        <div className="w-30 h-30 rounded-full overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
        </div>
        <div className="text-sm font-semibold leading-tight">
          <div className="truncate max-w-[10rem]">{displayName}</div>
          <div className="text-xs text-black/60 dark:text-white/60">Student</div>
        </div>
      </div>
      <nav className="flex flex-col gap-1 text-sm">
        {items.map((i) => {
          const active = pathname === i.href;
          return (
            <Link
              key={i.label}
              href={i.href}
              className={`rounded px-3 py-2 hover:bg-black/[.04] dark:hover:bg-white/[.08] ${
                active ? "bg-black/[.06] dark:bg-white/[.10] font-medium" : ""
              }`}
            >
              {i.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


