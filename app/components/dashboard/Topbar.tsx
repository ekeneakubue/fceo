"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Topbar({ displayName }: { displayName?: string }) {
  const router = useRouter();
  const [name, setName] = useState<string>("Super Admin");
  const [avatarSrc, setAvatarSrc] = useState<string>("/images/fceo-logo.jpg");

  const handleLogout = () => {
    try {
      const raw = localStorage.getItem("fceo.currentUser");
      let role = "";
      if (raw) {
        const u = JSON.parse(raw);
        role = String(u?.roleKey || u?.roleLabel || "").toUpperCase();
      }
      localStorage.removeItem("fceo.currentUser");
      const target = role.includes("STUDENT") ? "/student-login" : "/staff-login";
      router.push(target);
    } catch {
      router.push("/staff-login");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // Try to determine an identity (from local storage) to match in DB
        let identEmail: string | null = null;
        let identRegNo: string | null = null;
        try {
          const rawCurrent = localStorage.getItem("fceo.currentUser");
          if (rawCurrent) {
            const parsed = JSON.parse(rawCurrent);
            identEmail = (parsed?.email || "").toString().trim().toLowerCase() || null;
            identRegNo = (parsed?.regNo || "").toString().trim().toLowerCase() || null;
          }
        } catch {}

        const res = await fetch("/api/demo-users", { cache: "no-store" });
        if (!res.ok) return;
        const list = await res.json();
        if (!Array.isArray(list) || list.length === 0) return;

        // Preference order: match by email, then regNo, then SUPER_ADMIN, else first
        let current = null as any;
        if (identEmail) {
          current = list.find((u: any) => (u?.email || "").toString().toLowerCase() === identEmail) || null;
        }
        if (!current && identRegNo) {
          current = list.find((u: any) => (u?.regNo || "").toString().toLowerCase() === identRegNo) || null;
        }
        if (!current) {
          current = list.find((u: any) => (u?.roleKey || u?.roleLabel || "").toString().toUpperCase().includes("SUPER_ADMIN")) || null;
        }
        if (!current) current = list[0];

        if (current) {
          const display = current.fullName || current.email || "User";
          const avatar = current.avatarDataUrl || "/images/fceo-logo.jpg";
          setName(display);
          setAvatarSrc(avatar);
        }
      } catch {}
    })();
  }, []);
  return (
    <div className="w-full border-b border-black/[.08] dark:border-white/[.14] bg-white/70 dark:bg-white/5 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="text-sm md:text-base font-medium">Dashboard</div>
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
          <Image src={avatarSrc} alt="User avatar" fill className="object-cover" />
        </div>
        <span className="hidden sm:block text-sm font-medium">{displayName || name}</span>
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-2 rounded border border-black/[.12] dark:border-white/[.18] hover:bg-black/[.04] dark:hover:bg-white/[.08]"
        >
          Logout
        </button>
      </div>
    </div>
  );
}


