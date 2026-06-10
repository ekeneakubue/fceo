import { PageHeader, Panel } from "../../../components/dashboard/DashboardUI";

export default function RolesPage() {
  return (
    <>
      <PageHeader
        title="Roles & Permissions"
        description="Define roles and permission policies for staff across the institution."
      />
      <Panel title="Role Management">
        <div className="p-8 text-center text-slate-500">
          <p className="text-sm">Role policy configuration will be available here.</p>
          <p className="text-xs mt-2 text-slate-400">
            Current roles include Super Admin, Admin, Director, Dean, HoD, Principal Officer, Lecturer, Staff, and Parent.
          </p>
        </div>
      </Panel>
    </>
  );
}
