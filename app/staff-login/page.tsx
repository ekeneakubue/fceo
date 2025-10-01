"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <main className="max-w-6xl mx-auto px-6 py-12 mt-[4rem] grid md:grid-cols-1">
        <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 px-12 lg:w-[50%] mx-auto bg-white/70 dark:bg-white/5">
          <Link href="/">
            <div className="flex justify-center w-[100%]"><img src="/images/fceo-logo.jpg" alt="" className="w-[25%]"/></div>
          </Link>
          <h2 className="text-xl font-semibold">Staff Login</h2>
          <form
            className="mt-4 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              try {
                const ident = (email || "").trim().toLowerCase();
                let selected: any = null;
                try {
                  const list = await fetch("/api/demo-users", { cache: "no-store" }).then((r) => r.json());
                  if (Array.isArray(list)) {
                    selected = list.find((u: any) =>
                      (u.email && String(u.email).toLowerCase() === ident) ||
                      (u.regNo && String(u.regNo).toLowerCase() === ident) ||
                      (u.fullName && String(u.fullName).toLowerCase() === ident)
                    ) || null;
                  }
                } catch {}

                const fallback = {
                  id: "local-super-admin",
                  fullName: "Demo Super Admin",
                  email: "super@local",
                  regNo: "FCEO/ADMIN/LOCAL",
                  roleKey: "SUPER_ADMIN",
                  roleLabel: "Super Admin",
                  avatarDataUrl: null,
                };
                const current = selected || fallback;

                try {
                  localStorage.setItem("fceo.currentUser", JSON.stringify(current));
                } catch {}
                if (!selected) {
                  try {
                    await fetch("/api/demo-users", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ ...current, password: "admin123" }),
                    });
                  } catch {}
                }

                const role = String(current.roleKey || current.roleLabel || "").toUpperCase();
                const target = role.includes("SUPER_ADMIN")
                  ? "/dashboard/super-admin"
                  : role.includes("ADMIN")
                  ? "/dashboard/admin"
                  : role.includes("LECTURER")
                  ? "/dashboard/lecturer"
                  : "/dashboard/super-admin";
                router.push(target);
              } catch {
                router.push("/dashboard/super-admin");
              }
            }}
          >
            <div>
              <label className="block text-sm mb-1">Staff Email</label>
              <input
                className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black"
                type="text"
                placeholder="Eg: staff@fceo.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black pr-16"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="*************"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm px-2 py-1 rounded border border-black/20"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2"><input type="checkbox" /> Remember me</label>
              <a href="#" className="underline underline-offset-4">Forgot password?</a>
            </div>
            <button className="w-full h-11 rounded bg-[rgb(3,158,29)] text-white font-medium">Sign in</button>
          </form>
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          <div className="mt-6 text-sm">
            <span>New staff? </span>
            <a href="#" className="underline underline-offset-4">Create Account</a>
          </div>
        </div>
      </main>
    </div>
  );
}

