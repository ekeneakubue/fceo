"use client";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Link from "next/link";
import { useState } from "react";

export default function ApplicationFormPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [programme, setProgramme] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div>
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold">Welcome to Admission Portal</h1>
          <Link href="/admission/print-letter" className="text-sm underline underline-offset-4">Print Admission Letter</Link>
        </div>
        <p className="text-black/80 dark:text-white/80 mt-3 max-w-3xl">
          Before you can view and fill available forms, create an account if this is your first time here.
          Returning applicants can log in at the left to start a new application or continue a previous one.
        </p>
        <p className="text-black/80 dark:text-white/80 mt-3 max-w-4xl">
          On successful completion of your application, print a hard copy of your application form, acknowledgment slip,
          and evidence of payment. Attach photocopies of your credentials and submit to the Admission Office.
        </p>
        <p className="text-[13px] text-black/60 dark:text-white/60 mt-2">
          Note: To apply for POST UTME SCREENING 2025/2026 select the corresponding option under &quot;Applying For&quot;.
        </p>
      </section>

      {/* Two-column layout */}
      <section className="max-w-6xl mx-auto px-6 pb-14 grid gap-8 md:grid-cols-3">
        {/* Left: Applicant Login */}
        <aside className="md:col-span-1 space-y-4">
          <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5 p-5">
            <h2 className="text-lg font-semibold">Applicant Login</h2>
            <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" type="email" />
              </div>
              <div>
                <label className="block text-sm mb-1">Password</label>
                <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" type="password" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <a href="#" className="underline underline-offset-4">Forgotten Password</a>
              </div>
              <button className="w-full h-11 rounded bg-[rgb(3,158,29)] text-white font-medium">Log in</button>
            </form>
          </div>
        </aside>

        {/* Right: Create Account */}
        <div className="md:col-span-2 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5 p-6">
          <h2 className="text-lg md:text-xl font-semibold">Create New Account</h2>
          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm mb-1">First Name</label>
              <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Last Name</label>
              <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Applying For</label>
              <select className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={programme} onChange={(e) => setProgramme(e.target.value)} required>
                <option value="">Select Programme</option>
                <option value="pre-nce">PRE-NCE</option>
                <option value="post-utme-2025">POST UTME SCREENING 2025/2026</option>
                <option value="nce-part-time">NCE Part-Time</option>
                <option value="undergrad-part-time">Undergraduate Part-Time</option>
                <option value="pde">Professional Diploma in Education (PDE)</option>
                <option value="computer-certificate-pt">Computer Certificate Part-Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Mobile Phone Number</label>
              <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            {/* Captcha placeholder */}
            <div className="md:col-span-2 grid md:grid-cols-3 items-center gap-3 mt-2">
              <div className="md:col-span-1 text-sm">Enter this Character Below</div>
              <div className="md:col-span-1">
                <div className="h-10 w-40 rounded bg-black/10 grid place-items-center text-black/70">CAPTCHA</div>
              </div>
              <div className="md:col-span-1">
                <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" placeholder="Enter characters" />
              </div>
            </div>

            <div className="md:col-span-2 mt-2">
              <button className="h-11 px-6 rounded bg-[rgb(3,158,29)] text-white font-medium">Create Account</button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}


