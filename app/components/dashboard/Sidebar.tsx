"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Overview", href: "/dashboard/super-admin" },
  { label: "Users", href: "/dashboard/super-admin/users" },
  { label: "Lecturers", href: "/dashboard/super-admin/lecturers" },
  { label: "Students", href: "/dashboard/super-admin/students" },
  { label: "Programs", href: "/dashboard/super-admin/programs" },
  { label: "Timetable", href: "/dashboard/super-admin/timetable" },
  { label: "News", href: "/dashboard/super-admin/news" },
  { label: "Gallery", href: "/dashboard/super-admin/gallery" },
  { label: "User Settings", href: "/dashboard/super-admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const mainItems = items.filter((i) => i.label !== "User Settings");
  const settingsItem = items.find((i) => i.label === "User Settings");
  return (
    <aside className="h-screen sticky top-0 w-64 bg-white/90 dark:bg-black/30 border-r border-black/[.08] dark:border-white/[.14] p-4 hidden md:flex md:flex-col">
      <div className="text-lg font-semibold mb-4">FCEO Admin</div>
      <nav className="flex flex-col gap-1 text-sm">
        {mainItems.map((i) => {
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
      {settingsItem && (
        <div className="mt-auto pt-3 border-t border-black/[.08] dark:border-white/[.14]">
          <Link
            href={settingsItem.href}
            className={`block rounded px-3 py-2 text-sm hover:bg-black/[.04] dark:hover:bg-white/[.08] ${
              pathname === settingsItem.href ? "bg-black/[.06] dark:bg-white/[.10] font-medium" : ""
            }`}
          >
            {settingsItem.label}
          </Link>
        </div>
      )}
    </aside>
  );
}


