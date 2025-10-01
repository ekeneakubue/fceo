"use client";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import Topbar from "../../../components/dashboard/Topbar";

type StoredUser = {
  id?: string;
  email?: string;
  fullName?: string;
  regNo?: string;
  roleKey?: string;
  roleLabel?: string;
  avatarDataUrl?: string;
  password?: string;
};

export default function SettingsPage() {
  const [loaded, setLoaded] = useState(false);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [current, setCurrent] = useState<StoredUser | null>(null);
  const [avatarDataUrl, setAvatarDataUrl] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPwd, setShowPwd] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    try {
      const rawUsers = localStorage.getItem("fceo.users");
      const list = rawUsers ? JSON.parse(rawUsers) : [];
      if (Array.isArray(list)) setUsers(list);

      let cur: StoredUser | null = null;
      const rawCurrent = localStorage.getItem("fceo.currentUser");
      if (rawCurrent) {
        cur = JSON.parse(rawCurrent);
      }
      if (!cur && Array.isArray(list)) {
        cur = list.find(
          (u: StoredUser) => (u.roleKey || u.roleLabel)?.toUpperCase().includes("SUPER_ADMIN")
        ) || list[0] || null;
      }
      if (cur) {
        setCurrent(cur);
        setAvatarDataUrl(cur.avatarDataUrl || "");
        setPassword(cur.password || "");
      }
    } catch {
      // ignore
    } finally {
      setLoaded(true);
    }
  }, []);

  const readOnlyFields = useMemo(() => {
    return {
      fullName: current?.fullName || "",
      email: current?.email || "",
      regNo: current?.regNo || "",
    };
  }, [current]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!current) return;
    try {
      const payload: StoredUser = {
        ...current,
        avatarDataUrl: avatarDataUrl || undefined,
        password: password || undefined,
      };

      let updated: any = payload;
      if ((current as any)?.id) {
        const res = await fetch("/api/demo-users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        updated = await res.json();
      }
      localStorage.setItem("fceo.currentUser", JSON.stringify(updated));
      const refreshed = await fetch("/api/demo-users").then((r) => r.json());
      setUsers(refreshed);
      setCurrent(updated);
      setMessage("Profile updated");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Failed to update");
      setTimeout(() => setMessage(""), 2000);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <Sidebar />
      <main className="px-0">
        <Topbar />
        <div className="px-6 py-8">
          <h1 className="text-2xl md:text-3xl font-semibold">User Settings</h1>
          <p className="text-black/80 dark:text-white/80 mt-2">Manage your profile and preferences.</p>

          <div className="mt-8 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5 overflow-hidden">
            <div className="px-4 py-3 bg-black/5 dark:bg-white/10 font-semibold">Update Profile</div>
            <form className="p-4 grid gap-4 md:grid-cols-2" onSubmit={saveProfile}>
              <div>
                <label className="block text-xs mb-1">Full name</label>
                <input
                  className="w-full px-3 py-2 rounded border border-black/20 bg-zinc-100 text-black"
                  value={readOnlyFields.fullName}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded border border-black/20 bg-zinc-100 text-black"
                  value={readOnlyFields.email}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Reg No</label>
                <input
                  className="w-full px-3 py-2 rounded border border-black/20 bg-zinc-100 text-black"
                  value={readOnlyFields.regNo}
                  placeholder="—"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black pr-16"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded border border-black/20"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs mb-1">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return setAvatarDataUrl("");
                    const reader = new FileReader();
                    reader.onload = () => setAvatarDataUrl(reader.result as string);
                    reader.readAsDataURL(file);
                  }}
                />
                {(avatarDataUrl || current?.avatarDataUrl) && (
                  <div className="mt-2 w-16 h-16 rounded-full overflow-hidden ring-1 ring-black/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatarDataUrl || current?.avatarDataUrl || ""} alt="Avatar preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="md:col-span-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAvatarDataUrl(current?.avatarDataUrl || "");
                    setPassword(current?.password || "");
                  }}
                  className="h-10 px-4 rounded border border-black/20 text-sm"
                >
                  Reset
                </button>
                <button type="submit" className="h-10 px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium">Save changes</button>
              </div>
              {loaded && message && (
                <div className="md:col-span-2 text-sm text-green-700">{message}</div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}


