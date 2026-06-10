"use client";
import { useEffect, useState } from "react";
import { formatRoleLabel } from "@/lib/roles";

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
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const r = await fetch("/api/users", { cache: "no-store" });
      let data: any = null;
      try {
        data = await r.json();
      } catch {
        data = null;
      }
      if (!r.ok) {
        setUsers([]);
        setFetchError(data?.error || `Failed to load users (${r.status})`);
        return;
      }
      if (!Array.isArray(data)) {
        setUsers([]);
        setFetchError("Unexpected response from server.");
        return;
      }
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setFetchError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
<div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Users</h1>
              <p className="text-slate-600 mt-2">Fetched from database <code>User</code> on Neon.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const raw = localStorage.getItem("fceo.users") || localStorage.getItem("fceo.demoUsers");
                    const usersLs = raw ? JSON.parse(raw) : [];
                    if (Array.isArray(usersLs) && usersLs.length > 0) {
                      await fetch("/api/sync", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ users: usersLs }),
                      });
                      await loadUsers();
                    }
                  } catch (error) {
                    console.error("Error syncing users:", error);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="dash-btn-secondary h-10 px-4 text-sm"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border border-black/20 border-t-black/60"></div>
                    Syncing...
                  </div>
                ) : (
                  "Publish Local Users"
                )}
              </button>
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
                className="dash-btn-primary h-10 px-4 text-sm"
              >
                Add user
              </button>
            </div>
          </div>

          {showAdd && (
            <div
              className="fixed inset-0 bg-black/50 z-50 grid place-items-center"
              role="dialog"
              aria-modal="true"
            >
              <form
                className="w-[95%] max-w-2xl grid gap-4 md:grid-cols-2 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-zinc-900 p-5"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setStatusMsg("");
                  setSaving(true);
                  try {
                    const newUser: StoredUser = {
                      fullName,
                      email,
                      roleKey,
                      roleLabel: formatRoleLabel(roleKey),
                      avatarDataUrl,
                      password,
                    };
                    let createdOrUpdated: any = null;
                    if (editIndex >= 0 && (users[editIndex] as any)?.id) {
                      const id = (users[editIndex] as any).id as string;
                      const res = await fetch("/api/users", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id, ...newUser }),
                      });
                      if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.error || "Failed to update user");
                      }
                      createdOrUpdated = await res.json();
                      const nextUsers = users.map((u, i) => (i === editIndex ? createdOrUpdated : u));
                      setUsers(nextUsers);
                    } else {
                      const res = await fetch("/api/users", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newUser),
                      });
                      if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.error || "Failed to create user");
                      }
                      createdOrUpdated = await res.json();
                      setUsers([...users, createdOrUpdated]);
                    }
                    setStatusMsg("User saved to database");
                    try {
                      const raw = localStorage.getItem("fceo.currentUser");
                      if (raw && createdOrUpdated?.email) {
                        const current = JSON.parse(raw);
                        if (
                          String(current?.email || "").toLowerCase() ===
                          String(createdOrUpdated.email).toLowerCase()
                        ) {
                          const merged = { ...current, ...createdOrUpdated };
                          localStorage.setItem("fceo.currentUser", JSON.stringify(merged));
                          window.dispatchEvent(
                            new CustomEvent("fceo:user-updated", { detail: { user: merged } })
                          );
                        }
                      }
                    } catch {}
                    setShowAdd(false);
                    setFullName("");
                    setEmail("");
                    setRoleKey("LECTURER");
                    setAvatarDataUrl(undefined);
                    setPassword("");
                    setEditIndex(-1);
                  } catch (err: any) {
                    console.error("Error saving user:", err);
                    setStatusMsg(err?.message || "Failed to save user");
                  } finally {
                    setSaving(false);
                    setTimeout(() => setStatusMsg(""), 2500);
                  }
                }}
              >
                <div className="md:col-span-2 text-lg font-semibold">{editIndex >= 0 ? "Edit user" : "Add user"}</div>
                <div>
                  <label className="block text-xs mb-1">Full name</label>
                  <input
                    className="dash-input"
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
                    className="dash-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Role</label>
                  <select
                    className="dash-input"
                    value={roleKey}
                    onChange={(e) => setRoleKey(e.target.value)}
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="DIRECTOR">Director</option>
                    <option value="DEAN">Dean</option>
                    <option value="HOD">Head of Department (HoD)</option>
                    <option value="PRINCIPAL_OFFICER">Principal Officer</option>
                    <option value="REGISTRAR">Registrar</option>
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
                <div className="md:col-span-2 flex items-center justify-between gap-2">
                  <div className="text-xs text-slate-500">{statusMsg}</div>
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="dash-btn-secondary h-10 px-4 text-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="dash-btn-primary h-10 px-4 text-sm">{saving ? "Saving..." : "Save"}</button>
                </div>
              </form>
            </div>
          )}

          {fetchError && (
            <div className="mt-6 rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-red-800 dark:text-red-200">{fetchError}</p>
              <button
                type="button"
                onClick={loadUsers}
                disabled={loading}
                className="h-9 px-4 rounded border border-red-300 dark:border-red-700 text-sm text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-60"
              >
                {loading ? "Retrying..." : "Retry"}
              </button>
            </div>
          )}

          <div className="mt-6 dash-panel overflow-hidden">
            <div className="px-4 py-3 bg-black/5 dark:bg-white/10 font-semibold">All Users</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm dash-table">
                <thead className="bg-black/5 dark:bg-white/10 text-slate-600">
                  <tr>
                    <th className="text-left px-4 py-2">Avatar</th>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Email</th>
                    <th className="text-left px-4 py-2">Role</th>
                    <th className="text-left px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 dark:divide-white/10">
                  {loading ? (
                    <tr>
                      <td className="px-4 py-8" colSpan={5}>
                        <div className="flex items-center justify-center gap-2 text-black/60 dark:text-white/60">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-black/20 border-t-black/60"></div>
                          Fetching users...
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4" colSpan={5}>
                        {fetchError
                          ? "Users could not be loaded."
                          : 'No users found. Click "Add user" to create a new user.'}
                      </td>
                    </tr>
                  ) : (
                    users.map((u, idx) => (
                      <tr key={(u.id || u.email || "user") + "-" + idx} className="hover:bg-black/5 dark:hover:bg-white/10">
                        <td className="px-4 py-2">
                          <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-black/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={u.avatarDataUrl || "/images/fceo-logo.jpg"}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/fceo-logo.jpg";
                              }}
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
                                fetch(`/api/users?id=${encodeURIComponent(String(id))}`, { method: "DELETE" })
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
    </>
  );
}


