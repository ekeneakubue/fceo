"use client";
import SidebarStudent from "../../../components/dashboard/SidebarStudent";
import Topbar from "../../../components/dashboard/Topbar";
import { useEffect, useState } from "react";

export default function StudentSettingsPage() {
  const [avatarDataUrl, setAvatarDataUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fceo.currentUser");
      if (raw) {
        const u = JSON.parse(raw);
        setAvatarDataUrl(u?.avatarDataUrl || "");
      }
    } catch {}
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      const raw = localStorage.getItem("fceo.currentUser");
      if (!raw) return;
      const cur = JSON.parse(raw);
      const payload = { ...cur, avatarDataUrl: avatarDataUrl || undefined };
      let updated = payload;
      if (cur?.id) {
        const res = await fetch("/api/demo-users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        updated = await res.json();
      }
      localStorage.setItem("fceo.currentUser", JSON.stringify(updated));
      setMessage("Saved");
      setTimeout(() => setMessage(""), 2000);
    } catch {}
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <SidebarStudent />
      <main className="px-0">
        <Topbar />
        <div className="px-6 py-8">
          <h1 className="text-2xl md:text-3xl font-semibold">User Settings</h1>
          <p className="text-black/80 dark:text-white/80 mt-2">Update your profile avatar.</p>
          <form className="mt-6 grid gap-4 md:max-w-md" onSubmit={save}>
            <div>
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
              {avatarDataUrl && (
                <div className="mt-2 w-16 h-16 rounded-full overflow-hidden ring-1 ring-black/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarDataUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <button type="submit" className="h-10 px-4 rounded bg-[rgb(3,158,29)] text-white text-sm font-medium">Save changes</button>
            </div>
            {message && <div className="text-sm text-green-700">{message}</div>}
          </form>
        </div>
      </main>
    </div>
  );
}


