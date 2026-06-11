export type DashboardRole = "super-admin" | "registrar" | "admin" | "lecturer" | "student";

export type NavItem = {
  label: string;
  href?: string;
  icon: string;
  footer?: boolean;
  children?: Array<{ label: string; href: string; icon: string }>;
};

export type NavConfig = {
  title: string;
  subtitle: string;
  items: NavItem[];
};

export const NAV_CONFIG: Record<DashboardRole, NavConfig> = {
  "super-admin": {
    title: "FCEO Admin",
    subtitle: "Super Admin",
    items: [
      { label: "Overview", href: "/dashboard/super-admin", icon: "home" },
      {
        label: "User Management",
        icon: "user-management",
        children: [
          { label: "Users", href: "/dashboard/super-admin/users", icon: "users" },
          { label: "Lecturers", href: "/dashboard/super-admin/lecturers", icon: "lecturer" },
          { label: "Applicants", href: "/dashboard/super-admin/applicants", icon: "applicants" },
          { label: "Students", href: "/dashboard/super-admin/students", icon: "students" },
        ],
      },
      { label: "Schools", href: "/dashboard/super-admin/schools", icon: "schools" },
      { label: "Programs", href: "/dashboard/super-admin/programs", icon: "programs" },
      { label: "Timetable", href: "/dashboard/super-admin/timetable", icon: "calendar" },
      { label: "News", href: "/dashboard/super-admin/news", icon: "news" },
      { label: "Gallery", href: "/dashboard/super-admin/gallery", icon: "gallery" },
      { label: "Manage Hero", href: "/dashboard/super-admin/hero", icon: "hero" },
      { label: "Roles", href: "/dashboard/super-admin/roles", icon: "shield" },
      { label: "Widgets", href: "/dashboard/super-admin/widgets", icon: "widgets" },
      { label: "Settings", href: "/dashboard/super-admin/settings", icon: "settings", footer: true },
    ],
  },
  registrar: {
    title: "FCEO Admin",
    subtitle: "Registrar",
    items: [
      { label: "Overview", href: "/dashboard/registrar", icon: "home" },
      { label: "Applicants", href: "/dashboard/registrar/applicants", icon: "applicants" },
      { label: "Settings", href: "/dashboard/registrar/settings", icon: "settings", footer: true },
    ],
  },
  admin: {
    title: "FCEO Admin",
    subtitle: "Administrator",
    items: [
      { label: "Overview", href: "/dashboard/admin", icon: "home" },
      { label: "Users", href: "/dashboard/admin/users", icon: "users" },
      { label: "Lecturers", href: "/dashboard/admin/lecturers", icon: "lecturer" },
      { label: "Students", href: "/dashboard/admin/students", icon: "students" },
      { label: "Programs", href: "/dashboard/admin/programs", icon: "programs" },
      { label: "Timetable", href: "/dashboard/admin/timetable", icon: "calendar" },
      { label: "News", href: "/dashboard/admin/news", icon: "news" },
      { label: "Gallery", href: "/dashboard/admin/gallery", icon: "gallery" },
      { label: "Settings", href: "/dashboard/admin/settings", icon: "settings", footer: true },
    ],
  },
  lecturer: {
    title: "FCEO Portal",
    subtitle: "Lecturer",
    items: [
      { label: "Overview", href: "/dashboard/lecturer", icon: "home" },
      { label: "Timetable", href: "/dashboard/lecturer/timetable", icon: "calendar" },
      { label: "Settings", href: "/dashboard/lecturer/settings", icon: "settings", footer: true },
    ],
  },
  student: {
    title: "FCEO Portal",
    subtitle: "Student",
    items: [
      { label: "Overview", href: "/dashboard/student", icon: "home" },
      { label: "Profile", href: "/dashboard/student/profile", icon: "user" },
      { label: "Fees", href: "/dashboard/student/fees", icon: "fees" },
      { label: "Courses", href: "/dashboard/student/courses", icon: "courses" },
      { label: "Books", href: "/dashboard/student/books", icon: "books" },
      { label: "Hostel", href: "/dashboard/student/hostel", icon: "hostel" },
      { label: "Settings", href: "/dashboard/student/settings", icon: "settings", footer: true },
    ],
  },
};

export function detectDashboardRole(pathname: string): DashboardRole {
  if (pathname.startsWith("/dashboard/super-admin")) return "super-admin";
  if (pathname.startsWith("/dashboard/registrar")) return "registrar";
  if (pathname.startsWith("/dashboard/admin")) return "admin";
  if (pathname.startsWith("/dashboard/lecturer")) return "lecturer";
  return "student";
}

function findNavLabel(items: NavItem[], pathname: string): string | undefined {
  for (const item of items) {
    if (item.href === pathname) return item.label;
    if (item.children) {
      const child = item.children.find((c) => c.href === pathname);
      if (child) return child.label;
    }
  }
  return undefined;
}

export function getPageTitle(pathname: string, role: DashboardRole): string {
  const config = NAV_CONFIG[role];
  return findNavLabel(config.items, pathname) || config.subtitle;
}
