import { QuickActionCard, StatCard, WelcomeBanner } from "../../components/dashboard/DashboardUI";

export default function AdminOverviewPage() {
  return (
    <>
      <WelcomeBanner
        badge="Administrator"
        title="Admin Dashboard"
        subtitle="Oversee students, programs, timetables, and campus content for Federal College of Education, Ofeme Ohuhu."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Users" value="Staff" hint="Manage lecturers & officers" icon="users" />
        <StatCard label="Students" value="Records" hint="Enrollment & profiles" icon="students" accent="blue" />
        <StatCard label="Programs" value="Academic" hint="Courses & departments" icon="programs" accent="amber" />
        <StatCard label="Timetable" value="Schedules" hint="Class timetables" icon="calendar" accent="violet" />
      </div>

      <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard title="Manage Users" description="Add and edit staff accounts." href="/dashboard/admin/users" icon="users" />
        <QuickActionCard title="Students" description="Browse and update student records." href="/dashboard/admin/students" icon="students" />
        <QuickActionCard title="Programs" description="Manage academic programmes." href="/dashboard/admin/programs" icon="programs" />
        <QuickActionCard title="Timetable" description="View and edit class schedules." href="/dashboard/admin/timetable" icon="calendar" />
        <QuickActionCard title="News" description="Publish campus announcements." href="/dashboard/admin/news" icon="news" />
        <QuickActionCard title="Gallery" description="Upload campus photo galleries." href="/dashboard/admin/gallery" icon="gallery" />
      </div>
    </>
  );
}
