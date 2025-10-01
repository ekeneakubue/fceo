"use client";
import { useEffect, useState } from "react";
import SidebarAdmin from "../../../components/dashboard/SidebarAdmin";
import Topbar from "../../../components/dashboard/Topbar";

type DemoUser = {
  id?: string;
  fullName?: string;
  email?: string;
  roleKey?: string;
  roleLabel?: string;
  avatarDataUrl?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roleKey, setRoleKey] = useState("LECTURER");
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | undefined>(undefined);
  const [showView, setShowView] = useState(false);
  const [viewIndex, setViewIndex] = useState<number>(-1);
  const [showAdd, setShowAdd] = useState(false);
  const [password, setPassword] = useState("");
  const [showAddPwd, setShowAddPwd] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/demo-users", { cache: "no-store" });
        const list = await res.json();
        if (!mounted) return;
        const filtered = Array.isArray(list)
          ? list.filter((u: any) => String(u?.roleKey || u?.roleLabel || "").toUpperCase() !== "SUPER_ADMIN")
          : [];
        setUsers(filtered);
      } catch {
        if (mounted) setUsers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <SidebarAdmin />
      <main className="px-0">
        <Topbar />
        <div className="px-6 py-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Users</h1>
              <p className="text-black/80 dark:text-white/80 mt-2">Fetched from database via /api/demo-users.</p>
            </div>
            <button
              onClick={() => {
                setEditIndex(-1);
                setFullName("");
                setEmail("");
                setRoleKey("LECTURER");
                setAvatarDataUrl(undefined);
                setShowAdd(true);
              }}
              className="h-10 px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium"
            >
              Add user
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-black/[.08] dark:border-white/[.145] overflow-hidden bg-white/70 dark:bg-white/5">
            <div className="px-4 py-3 bg-black/5 dark:bg-white/10 font-semibold">All Users</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80">
                  <tr>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Email</th>
                    <th className="text-left px-4 py-2">Role</th>
                    <th className="text-left px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/10">
                  {loading ? (
                    <tr>
                      <td className="px-4 py-4" colSpan={3}>Loading…</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4" colSpan={4}>No users found.</td>
                    </tr>
                  ) : (
                    users.map((u, idx) => (
                      <tr key={(u.id || u.email || "user") + "-" + idx} className="hover:bg-black/5 dark:hover:bg-white/10">
                        <td className="px-4 py-2">{u.fullName || "—"}</td>
                        <td className="px-4 py-2">{u.email || "—"}</td>
                        <td className="px-4 py-2">{u.roleLabel || u.roleKey || "—"}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <button
                              className="h-8 px-3 rounded border border-black/20 text-xs"
                              onClick={() => {
                                setViewIndex(idx);
                                setShowView(true);
                              }}
                            >
                              View
                            </button>
                            <button
                              className="h-8 px-3 rounded border border-black/20 text-xs"
                              onClick={() => {
                                setEditIndex(idx);
                                setFullName(u.fullName || "");
                                setEmail(u.email || "");
                                setRoleKey(u.roleKey || "LECTURER");
                                setAvatarDataUrl(u.avatarDataUrl);
                                setShowEdit(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="h-8 px-3 rounded bg-red-600 text-white text-xs"
                              onClick={async () => {
                                try {
                                  const id = u.id;
                                  if (!id) {
                                    const next = users.filter((_, i) => i !== idx);
                                    setUsers(next);
                                    return;
                                  }
                                  await fetch(`/api/demo-users?id=${encodeURIComponent(String(id))}`, { method: "DELETE" });
                                  const next = users.filter((_, i) => i !== idx);
                                  setUsers(next);
                                } catch {}
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showView && viewIndex >= 0 && users[viewIndex] && (
            <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center" role="dialog" aria-modal="true">
              <div className="w-[95%] max-w-md rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">User Details</h2>
                  <button
                    onClick={() => setShowView(false)}
                    className="h-8 px-3 rounded border border-black/20 text-xs"
                  >
                    Close
                  </button>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-black/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={users[viewIndex].avatarDataUrl || "/images/fceo-logo.jpg"}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-base font-medium">{users[viewIndex].fullName || "—"}</div>
                  </div>
                  <div className="text-sm"><span className="font-medium">Email:</span> {users[viewIndex].email || "—"}</div>
                  <div className="text-sm"><span className="font-medium">Role:</span> {users[viewIndex].roleLabel || users[viewIndex].roleKey || "—"}</div>
                  {users[viewIndex].id && (
                    <div className="text-xs text-black/70 dark:text-white/70"><span className="font-medium">ID:</span> {users[viewIndex].id}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showEdit && (
            <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center" role="dialog" aria-modal="true">
              <form
                className="w-[95%] max-w-2xl grid gap-4 md:grid-cols-2 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 p-5"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const current = users[editIndex];
                  if (!current) { setShowEdit(false); return; }
                  const id = current.id;
                  const payload: any = {
                    id,
                    fullName,
                    email,
                    roleKey,
                    roleLabel: roleKey
                      .toLowerCase()
                      .split("_")
                      .map((s) => (s[0] ? s[0].toUpperCase() + s.slice(1) : s))
                      .join(" "),
                    avatarDataUrl,
                  };
                  try {
                    let updated = payload;
                    if (id) {
                      const res = await fetch("/api/demo-users", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                      });
                      updated = await res.json();
                    }
                    const next = users.map((u, i) => (i === editIndex ? updated : u));
                    setUsers(next);
                  } catch {}
                  setShowEdit(false);
                  setEditIndex(-1);
                }}
              >
                <div className="md:col-span-2 text-lg font-semibold">Edit user</div>
                <div>
                  <label className="block text-xs mb-1">Full name</label>
                  <input
                    className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Role</label>
                  <select
                    className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black"
                    value={roleKey}
                    onChange={(e) => setRoleKey(e.target.value)}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="STAFF">Staff</option>
                    <option value="LECTURER">Lecturer</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs mb-1">Avatar</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return setAvatarDataUrl(undefined);
                      const reader = new FileReader();
                      reader.onload = () => setAvatarDataUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }}
                  />
                  {avatarDataUrl && (
                    <div className="mt-2 w-16 h-16 rounded-full overflow-hidden ring-1 ring-black/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={avatarDataUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEdit(false)}
                    className="h-10 px-4 rounded border border-black/20 text-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="h-10 px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium">Save</button>
                </div>
              </form>
            </div>
          )}

          {showAdd && (
            <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center" role="dialog" aria-modal="true">
              <form
                className="w-[95%] max-w-2xl grid gap-4 md:grid-cols-2 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 p-5"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const payload: any = {
                    fullName,
                    email,
                    roleKey,
                    roleLabel: roleKey
                      .toLowerCase()
                      .split("_")
                      .map((s) => (s[0] ? s[0].toUpperCase() + s.slice(1) : s))
                      .join(" "),
                    avatarDataUrl,
                    password: password || undefined,
                  };
                  try {
                    const res = await fetch("/api/demo-users", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    const created = await res.json();
                    const isSuperAdmin = String(created?.roleKey || created?.roleLabel || "").toUpperCase() === "SUPER_ADMIN";
                    if (!isSuperAdmin) setUsers((prev) => [...prev, created]);
                  } catch {}
                  setShowAdd(false);
                  setFullName("");
                  setEmail("");
                  setRoleKey("LECTURER");
                  setAvatarDataUrl(undefined);
                  setPassword("");
                }}
              >
                <div className="md:col-span-2 text-lg font-semibold">Add user</div>
                <div>
                  <label className="block text-xs mb-1">Full name</label>
                  <input
                    className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showAddPwd ? "text" : "password"}
                      className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black pr-16"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAddPwd((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded border border-black/20"
                      aria-label={showAddPwd ? "Hide password" : "Show password"}
                    >
                      {showAddPwd ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1">Role</label>
                  <select
                    className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black"
                    value={roleKey}
                    onChange={(e) => setRoleKey(e.target.value)}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="STAFF">Staff</option>
                    <option value="LECTURER">Lecturer</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs mb-1">Avatar</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return setAvatarDataUrl(undefined);
                      const reader = new FileReader();
                      reader.onload = () => setAvatarDataUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }}
                  />
                  {avatarDataUrl && (
                    <div className="mt-2 w-16 h-16 rounded-full overflow-hidden ring-1 ring-black/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={avatarDataUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="h-10 px-4 rounded border border-black/20 text-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="h-10 px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium">Save</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


