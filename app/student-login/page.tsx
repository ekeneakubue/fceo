"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StudentLoginPage() {
  const [identInput, setIdentInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div>
      <main className="max-w-6xl mx-auto px-6 py-12 mt-[4rem] grid gap-10 md:grid-cols-2">
        <div className="grid place-items-center">
          <h2 className="text-xl md:text-2xl font-semibold">Registration Instructions</h2>
          <ol className="mt-4 list-decimal ps-5 space-y-2 text-sm text-black/80 dark:text-white/80">
            <li>Visit the College ICT Centre to obtain your PIN Card.</li>
            <li>
              Logon to{" "}
              <a className="underline underline-offset-4" href="http://www.fceo.edu.ng" target="_blank" rel="noopener noreferrer">http://www.fceo.edu.ng</a>
            </li>
            <li>Click on the Portal</li>
            <li>Use your Jamb/Matric/Pre-NCE Admission number as your Username and Password to Login.</li>
            <li>Enter the PIN and Serial number of the PIN Card to activate your account.</li>
            <li>Click on Payment to generate payment RRR</li>
          </ol>
        </div>

        <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 px-12 bg-white/70 dark:bg-white/5">
          <Link href="/">
            <div className="flex justify-center w-[100%]"><img src="/images/fceo-logo.jpg" alt="" className="w-[25%]"/></div>
          </Link>
          <h2 className="text-xl font-semibold">Student Login</h2>
          <form
            className="mt-4 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              try {
                const ident = (identInput || "").trim().toLowerCase();
                // Simple auth: password must equal regNo and student must exist in DB
                if ((password || "").trim().toLowerCase() !== ident) {
                  setError("Invalid credentials");
                  return;
                }
                let match: any = null;
                try {
                  const list = await fetch("/api/students", { cache: "no-store" }).then((r) => r.json());
                  if (Array.isArray(list)) {
                    match = list.find((s: any) => (s?.regNo || "").toString().trim().toLowerCase() === ident) || null;
                  }
                } catch {}
                // Fallback to localStorage (super-admin page stores here)
                if (!match) {
                  try {
                    const raw = localStorage.getItem("fceo.students");
                    if (raw) {
                      const arr = JSON.parse(raw);
                      if (Array.isArray(arr)) {
                        match = arr.find((s: any) => (s?.regNo || "").toString().trim().toLowerCase() === ident) || null;
                      }
                    }
                  } catch {}
                }
                if (!match) {
                  setError("Student not found");
                  return;
                }
                const fullName = [match.firstName, match.middleName, match.surname]
                  .filter(Boolean)
                  .join(" ")
                  .trim() || match.regNo;
                const current = {
                  id: match.id || "local-student",
                  fullName,
                  email: match.email || undefined,
                  regNo: match.regNo,
                  programme: match.programme || undefined,
                  roleKey: undefined,
                  roleLabel: "Student",
                  avatarDataUrl: match.avatarDataUrl || undefined,
                };
                try { localStorage.setItem("fceo.currentUser", JSON.stringify(current)); } catch {}
                router.push("/dashboard/student");
              } catch {
                setError("Login error. Try again.");
              }
            }}
          >
            <div>
              <label className="block text-sm mb-1">Reg No / Email / Name</label>
              <input
                className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black"
                type="text"
                placeholder="e.g., FCEO/2025/01234"
                value={identInput}
                onChange={(e) => setIdentInput(e.target.value)}
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
            <span>New student? </span>
            <a href="#" className="underline underline-offset-4">Create Account</a>
          </div>
        </div>
      </main>
    </div>
  );
}


