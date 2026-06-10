"use client";
import { useEffect, useMemo, useState } from "react";
type StoredUser = {
  id?: string;
  email?: string;
  fullName?: string;
  roleKey?: string;
  roleLabel?: string;
  avatarDataUrl?: string;
};

export default function LecturersPage() {
  const [users, setUsers] = useState<StoredUser[]>([]);

  useEffect(() => {
    fetch("/api/users").then(async (r) => setUsers(await r.json())).catch(() => {});
  }, []);

  const lecturers = useMemo(
    () => users.filter((u) => (u.roleKey || u.roleLabel)?.toUpperCase().includes("TEACHER") || (u.roleKey || u.roleLabel)?.toUpperCase().includes("LECTURER")),
    [users]
  );

  return (
    <>
<h1 className="text-2xl md:text-3xl font-semibold">Lecturers</h1>
          <p className="text-slate-600 mt-2">Users with lecturer/teacher role.</p>

          <div className="mt-6 dash-panel overflow-hidden">
            <div className="px-4 py-3 bg-black/5 dark:bg-white/10 font-semibold">All Lecturers</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm dash-table">
                <thead className="bg-black/5 dark:bg-white/10 text-slate-600">
                  <tr>
                    <th className="text-left px-4 py-2">Avatar</th>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Email</th>
                    <th className="text-left px-4 py-2">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/10">
                  {lecturers.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4" colSpan={4}>No lecturers found in storage.</td>
                    </tr>
                  ) : (
                    lecturers.map((u, idx) => (
                      <tr key={(u.id || u.email || "user") + "-" + idx} className="hover:bg-black/5 dark:hover:bg-white/10">
                        <td className="px-4 py-2">
                          <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-black/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={u.avatarDataUrl || "/images/fceo-logo.jpg"}
                              alt="avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2">{u.fullName || "—"}</td>
                        <td className="px-4 py-2">{u.email || "—"}</td>
                        <td className="px-4 py-2">{u.roleLabel || u.roleKey || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
    </>
  );
}


