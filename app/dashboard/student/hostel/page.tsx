import SidebarStudent from "../../../components/dashboard/SidebarStudent";
import Topbar from "../../../components/dashboard/Topbar";

export default function StudentHostelPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <SidebarStudent />
      <main className="px-0">
        <Topbar />
        <div className="px-6 py-8">
          <h1 className="text-2xl md:text-3xl font-semibold">Hostel</h1>
          <p className="text-black/80 dark:text-white/80 mt-2">Hostel accommodation details and application.</p>
        </div>
      </main>
    </div>
  );
}


