"use client";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { useState } from "react";

export default function AdmissionStatusPage() {
  const [regNo, setRegNo] = useState("");
  return (
    <div>
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-2xl md:text-3xl font-semibold">Admission Status</h1>
        <p className="text-black/80 dark:text-white/80 mt-2">Enter your Registration Number to check status.</p>
        <form className="mt-6 max-w-md space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm mb-1">Reg No</label>
            <input className="w-full px-3 py-2 rounded border border-black/20 bg-white text-black" value={regNo} onChange={(e) => setRegNo(e.target.value)} placeholder="FCEO/2025/01234" />
          </div>
          <button className="h-11 px-6 rounded bg-[rgb(3,158,29)] text-white font-medium">Check Status</button>
        </form>
      </section>
      <Footer />
    </div>
  );
}


