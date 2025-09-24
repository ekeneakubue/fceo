"use client";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
            <li>Use your Jamb number or Matriculation number or Pre-NCE Admission number as your Username and Password to Login.</li>
            <li>Enter the PIN and Serial number of the PIN Card to activate your account.</li>
            <li>Click on Payment to generate payment RRR</li>
            <li>On successful payment confirmed by clicking Status under Payment History, then you can proceed with your registration.</li>
            <li>Click on My Profile to update your profile.</li>
            <li>Click on Course Registration to register your courses</li>
            <li>For support, please visit the ICT unit:</li>
          </ol>
        </div>

        <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 px-12 bg-white/70 dark:bg-white/5">
        <div className="flex justify-center w-[100%]"><img src="/images/fceo-logo.jpg" alt="" className="w-[25%]"/></div>
          <h2 className="text-xl font-semibold">Login</h2>
          <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm mb-1">Reg No</label>
              <input
                className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black"
                type="text"
                placeholder="e.g., FCEO/2025/01234"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*************"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2"><input type="checkbox" /> Remember me</label>
              <a href="#" className="underline underline-offset-4">Forgot password?</a>
            </div>
            <button className="w-full h-11 rounded bg-[rgb(3,158,29)] text-white font-medium">Sign in</button>
          </form>
          <div className="mt-6 text-sm">
            <span>New student? </span>
            <a href="#" className="underline underline-offset-4">Create Account</a>
          </div>
        </div>
      </main>
    </div>
  );
}


