"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Overview", href: "/dashboard/admin" },
  { label: "Users", href: "/dashboard/admin/users" },
  { label: "Students", href: "/dashboard/admin/students" },
  { label: "Programs", href: "/dashboard/admin/programs" },
  { label: "Timetable", href: "/dashboard/admin/timetable" },
  { label: "News", href: "/dashboard/admin/news" },
  { label: "Gallery", href: "/dashboard/admin/gallery" },
  { label: "User Settings", href: "/dashboard/admin/settings" },
];

export default function SidebarAdmin() {
  const pathname = usePathname();
  return (
    <aside className="h-screen sticky top-0 w-64 bg-white/90 dark:bg-black/30 border-r border-black/[.08] dark:border-white/[.14] p-4 hidden md:flex md:flex-col">
      <div className="text-lg font-semibold mb-4">Admin</div>
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


