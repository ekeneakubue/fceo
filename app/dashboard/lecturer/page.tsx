import { QuickActionCard, StatCard, WelcomeBanner } from "../../components/dashboard/DashboardUI";

export default function LecturerOverviewPage() {
  return (
    <>
      <WelcomeBanner
        badge="Lecturer"
        title="Lecturer Portal"
        subtitle="Access your timetable, manage your profile, and stay connected with the academic schedule."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard label="Timetable" value="View" hint="Your weekly schedule" icon="calendar" />
        <StatCard label="Profile" value="Settings" hint="Update your details" icon="user" accent="blue" />
        <StatCard label="Portal" value="Active" hint="FCEO academic system" icon="home" accent="violet" />
      </div>

      <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <QuickActionCard title="My Timetable" description="View your class schedule for the week." href="/dashboard/lecturer/timetable" icon="calendar" />
        <QuickActionCard title="User Settings" description="Update your profile and password." href="/dashboard/lecturer/settings" icon="settings" />
      </div>
    </>
  );
}
