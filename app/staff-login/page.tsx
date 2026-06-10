"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative h-full staff-login-bg overflow-hidden flex items-center justify-center px-4">
      {/* Animated orbs */}
      <div
        aria-hidden
        className="staff-login-orb-a pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="staff-login-orb-b pointer-events-none absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl"
      />
      <div
        aria-hidden
        className="staff-login-orb-c pointer-events-none absolute -bottom-16 left-1/4 h-64 w-64 rounded-full bg-lime-200/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.12),transparent_55%)]"
      />

      <main className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl bg-white shadow-2xl shadow-black/20 border border-white/60 p-7 md:p-8">
          <Link href="/" className="flex justify-center mb-6">
            <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-brand-green/15 shadow-md">
              <Image src="/images/fceo-logo.jpg" alt="FCEO" fill className="object-cover" />
            </div>
          </Link>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Staff Login</h1>
            <p className="text-sm text-slate-500 mt-1">
              Federal College of Education, Ofeme Ohuhu
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
              try {
                const ident = (email || "").trim().toLowerCase();
                let selected: any = null;
                try {
                  const list = await fetch("/api/users", { cache: "no-store" }).then((r) =>
                    r.json()
                  );
                  if (Array.isArray(list)) {
                    selected =
                      list.find(
                        (u: any) =>
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
                    await fetch("/api/users", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ ...current, password: "admin123" }),
                    });
                  } catch {}
                }

                const role = String(current.roleKey || current.roleLabel || "").toUpperCase();
                const target = role.includes("SUPER_ADMIN")
                  ? "/dashboard/super-admin"
                  : role.includes("REGISTRAR")
                    ? "/dashboard/registrar"
                    : role.includes("ADMIN") ||
                        role.includes("DIRECTOR") ||
                        role.includes("DEAN") ||
                        role.includes("HOD") ||
                        role.includes("HEAD OF DEPARTMENT")
                      ? "/dashboard/admin"
                      : role.includes("LECTURER")
                        ? "/dashboard/lecturer"
                        : "/dashboard/super-admin";
                router.push(target);
              } catch {
                router.push("/dashboard/super-admin");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Staff Email
              </label>
              <input
                className="dash-input"
                type="text"
                placeholder="Eg: staff@fceo.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  className="dash-input pr-16"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium px-2.5 py-1 rounded-md text-brand-green hover:bg-brand-green-light transition-colors"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-brand-green focus:ring-brand-green" />
                Remember me
              </label>
              <a href="#" className="text-brand-green font-medium hover:underline underline-offset-4">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-brand-green text-white font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-brand-green/25"
            >
              {loading && (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
              )}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
