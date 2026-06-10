import { QuickActionCard, StatCard, WelcomeBanner } from "../../components/dashboard/DashboardUI";

export default function StudentOverviewPage() {
  return (
    <>
      <WelcomeBanner
        badge="Student"
        title="Student Portal"
        subtitle="Check your courses, fees, books, hostel allocation, and academic profile."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Profile" value="View" hint="Your academic details" icon="user" />
        <StatCard label="Courses" value="Enrolled" hint="Current semester" icon="courses" accent="blue" />
        <StatCard label="Fees" value="Payments" hint="Fee status & history" icon="fees" accent="amber" />
        <StatCard label="Hostel" value="Allocation" hint="Accommodation info" icon="hostel" accent="violet" />
      </div>

      <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard title="My Profile" description="View and update your student profile." href="/dashboard/student/profile" icon="user" />
        <QuickActionCard title="Courses" description="See your enrolled courses." href="/dashboard/student/courses" icon="courses" />
        <QuickActionCard title="Fees" description="Check payment status and history." href="/dashboard/student/fees" icon="fees" />
        <QuickActionCard title="Books" description="Access library and book resources." href="/dashboard/student/books" icon="books" />
        <QuickActionCard title="Hostel" description="View hostel allocation details." href="/dashboard/student/hostel" icon="hostel" />
        <QuickActionCard title="Settings" description="Update your account settings." href="/dashboard/student/settings" icon="settings" />
      </div>
    </>
  );
}
