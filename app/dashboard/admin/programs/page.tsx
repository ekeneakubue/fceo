import SidebarAdmin from "../../../components/dashboard/SidebarAdmin";
import Topbar from "../../../components/dashboard/Topbar";

export default function AdminProgramsPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <SidebarAdmin />
      <main className="px-0">
        <Topbar />
        <div className="px-6 py-8">
          <h1 className="text-2xl md:text-3xl font-semibold">Programs</h1>
          <p className="text-black/80 dark:text-white/80 mt-2">Admin programs management.</p>
        </div>
      </main>
    </div>
  );
}


