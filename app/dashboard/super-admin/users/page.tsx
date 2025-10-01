"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import Topbar from "../../../components/dashboard/Topbar";

type StoredUser = {
  id?: string;
  email?: string;
  fullName?: string;
  roleKey?: string;
  roleLabel?: string;
  avatarDataUrl?: string;
  password?: string; // demo only; do NOT store plaintext in production
};

export default function UsersPage() {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roleKey, setRoleKey] = useState("LECTURER");
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState("");
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [showModalPwd, setShowModalPwd] = useState(false);

  useEffect(() => {
    fetch("/api/demo-users").then(async (r) => setUsers(await r.json())).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <Sidebar />
      <main className="px-0">
        <Topbar />
        <div className="px-6 py-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Users</h1>
              <p className="text-black/80 dark:text-white/80 mt-2">Fetched from database <code>fceo.users</code>.</p>
            </div>
            <button
              onClick={() => {
                setEditIndex(-1);
                setFullName("");
                setEmail("");
                setRoleKey("LECTURER");
                setAvatarDataUrl(undefined);
                setPassword("");
                setShowAdd(true);
              }}
              className="h-10 px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium"
            >
              Add user
            </button>
          </div>

          {showAdd && (
            <div
              className="fixed inset-0 bg-black/50 z-50 grid place-items-center"
              role="dialog"
              aria-modal="true"
            >
              <form
                className="w-[95%] max-w-2xl grid gap-4 md:grid-cols-2 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 p-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const newUser: StoredUser = {
                    fullName,
                    email,
                    roleKey,
                    roleLabel: roleKey
                      .toLowerCase()
                      .split("_")
                      .map((s) => s[0].toUpperCase() + s.slice(1))
                      .join(" "),
                    avatarDataUrl,
                    password,
                  };
                  if (editIndex >= 0 && (users[editIndex] as any)?.id) {
                    const id = (users[editIndex] as any).id as string;
                    fetch("/api/demo-users", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id, ...newUser }),
                    })
                      .then(async (r) => {
                        const updated = await r.json();
                        const nextUsers = users.map((u, i) => (i === editIndex ? updated : u));
                        setUsers(nextUsers);
                      })
                      .catch(() => {});
                  } else {
                    fetch("/api/demo-users", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(newUser),
                    })
                      .then(async (r) => {
                        const created = await r.json();
                        setUsers([...users, created]);
                      })
                      .catch(() => {});
                  }
                  setFullName("");
                  setEmail("");
                  setRoleKey("LECTURER");
                  setAvatarDataUrl(undefined);
                  setPassword("");
                  setEditIndex(-1);
                  setShowAdd(false);
                }}
              >
                <div className="md:col-span-2 text-lg font-semibold">{editIndex >= 0 ? "Edit user" : "Add user"}</div>
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
                  <label className="block text-xs mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showModalPwd ? "text" : "password"}
                      className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black pr-16"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalPwd((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded border border-black/20"
                      aria-label={showModalPwd ? "Hide password" : "Show password"}
                    >
                      {showModalPwd ? "Hide" : "Show"}
                    </button>
                  </div>
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
                    <option value="SUPER_ADMIN">Super Admin</option>
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
                      reader.onload = () => {
                        const result = reader.result as string;
                        setAvatarDataUrl(result);
                      };
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

          <div className="mt-6 rounded-xl border border-black/[.08] dark:border-white/[.145] overflow-hidden bg-white/70 dark:bg-white/5">
            <div className="px-4 py-3 bg-black/5 dark:bg-white/10 font-semibold">All Users</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80">
                  <tr>
                    <th className="text-left px-4 py-2">Avatar</th>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Email</th>
                    <th className="text-left px-4 py-2">Role</th>
                    <th className="text-left px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/10">
                  {users.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4" colSpan={5}>No users in storage. Add some to localStorage under <code>fceo.users</code>.</td>
                    </tr>
                  ) : (
                    users.map((u, idx) => (
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
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <button
                              className="h-8 px-3 rounded border border-black/20 text-xs"
                              onClick={() => {
                                setEditIndex(idx);
                                setFullName(u.fullName || "");
                                setEmail(u.email || "");
                                setRoleKey(u.roleKey || "LECTURER");
                                setAvatarDataUrl(u.avatarDataUrl);
                                setPassword(u.password || "");
                                setShowAdd(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="h-8 px-3 rounded bg-red-600 text-white text-xs"
                              onClick={() => {
                                const id = (users as any)[idx]?.id;
                                if (!id) {
                                  const nextUsers = users.filter((_, i) => i !== idx);
                                  setUsers(nextUsers);
                                  return;
                                }
                                fetch(`/api/demo-users?id=${encodeURIComponent(String(id))}`, { method: "DELETE" })
                                  .then(() => {
                                    const nextUsers = users.filter((_, i) => i !== idx);
                                    setUsers(nextUsers);
                                  })
                                  .catch(() => {})
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
        </div>
      </main>
    </div>
  );
}


