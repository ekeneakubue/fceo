import { PageHeader, Panel } from "../../../components/dashboard/DashboardUI";

export default function WidgetsPage() {
  return (
    <>
      <PageHeader
        title="Dashboard Widgets"
        description="Configure role-scoped dashboard cards, links, and stats shown to each user type."
      />
      <Panel title="Widget Configuration">
        <div className="p-8 text-center text-slate-500">
          <p className="text-sm">Widget ordering and visibility controls will be available here.</p>
        </div>
      </Panel>
    </>
  );
}
