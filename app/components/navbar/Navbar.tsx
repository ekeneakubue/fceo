"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [aboutHover, setAboutHover] = useState(false);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [admissionHover, setAdmissionHover] = useState(false);
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false);
  const [academicsHover, setAcademicsHover] = useState(false);
  const [programsHover, setProgramsHover] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const toggleNavbar = () => setIsOpen((v) => !v);

  return (
    <nav className="bg-[rgb(3,158,29)] text-white">
      <div className="mx-auto max-w-7xl px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12">
            <img className="w-full h-full rounded" src="/images/fceo-logo.jpg" alt="logo" />
          </div>
          <h2 className="text-xl font-semibold">FCE Ofeme Ohuhu</h2>
        </div>
        <button className="md:hidden text-2xl" onClick={toggleNavbar}>☰</button>
        <div className={`hidden md:flex items-center gap-8 text-lg ${isOpen ? "flex" : "hidden"} md:!flex`}>
          <Link href="/" className="hover:text-black/70">Home</Link>
          <div
            className="relative"
            onMouseEnter={() => setAboutHover(true)}
            onMouseLeave={() => setAboutHover(false)}
          >
            <Link href="/about" className="hover:text-black/70">About</Link>
            <div
              className={`absolute left-0 top-full ${aboutHover ? "block" : "hidden"} bg-white text-black rounded shadow-lg min-w-[220px] py-2 z-20`}
              onMouseEnter={() => setAboutHover(true)}
              onMouseLeave={() => setAboutHover(false)}
            >
              <Link href="/about/history" className="block px-4 py-2 hover:bg-black/5">History</Link>
              <Link href="/about/vision-mission" className="block px-4 py-2 hover:bg-black/5">Vision &amp; Mission</Link>
              <Link href="/about/leadership" className="block px-4 py-2 hover:bg-black/5">Leadership</Link>
              <Link href="/about/campuses" className="block px-4 py-2 hover:bg-black/5">Campuses</Link>
            </div>
          </div>
          <div
            className="relative"
            onMouseEnter={() => setAcademicsHover(true)}
            onMouseLeave={() => setAcademicsHover(false)}
          >
            <Link href="/academics" className="hover:text-black/70">Academics</Link>
            <div
              className={`absolute left-0 top-full ${academicsHover ? "block" : "hidden"} bg-white text-black rounded shadow-lg min-w-[220px] py-2 z-20`}
              onMouseEnter={() => setAcademicsHover(true)}
              onMouseLeave={() => setAcademicsHover(false)}
            >
              <div
                className="relative"
                onMouseEnter={() => setProgramsHover(true)}
                onMouseLeave={() => setProgramsHover(false)}
              >
                <Link href="/academics/programs" className="block px-4 py-2 hover:bg-black/5">Programs ▸</Link>
                <div
                  className={`absolute left-full top-0 ${programsHover ? "block" : "hidden"} bg-white text-black rounded shadow-lg min-w-[240px] py-2 z-30`}
                >
                  <Link href="/academics/programs/nce-full-time" className="block px-4 py-2 hover:bg-black/5">NCE (Full-time)</Link>
                  <Link href="/academics/programs/nce-part-time" className="block px-4 py-2 hover:bg-black/5">NCE (Part-time)</Link>
                  <Link href="/academics/programs/degree" className="block px-4 py-2 hover:bg-black/5">Degree</Link>
                  <Link href="/academics/programs/post-graduate" className="block px-4 py-2 hover:bg-black/5">Post-Graduate</Link>
                </div>
              </div>
              <Link href="/schools" className="block px-4 py-2 hover:bg-black/5">Schools</Link>
            </div>
          </div>
          <div
            className="relative"
            onMouseEnter={() => setAdmissionHover(true)}
            onMouseLeave={() => setAdmissionHover(false)}
          >
            <Link href="/admission" className="hover:text-black/70">Admission</Link>
            <div
              className={`absolute left-0 top-full ${admissionHover ? "block" : "hidden"} bg-white text-black rounded shadow-lg min-w-[220px] py-2 z-20`}
              onMouseEnter={() => setAdmissionHover(true)}
              onMouseLeave={() => setAdmissionHover(false)}
            >
              <Link href="/admission/application-form" className="block px-4 py-2 hover:bg-black/5">Application Form</Link>
              <Link href="/admission/status" className="block px-4 py-2 hover:bg-black/5">Admission Status</Link>
              <Link href="/admission/print-letter" className="block px-4 py-2 hover:bg-black/5">Print Admission Letter</Link>
            </div>
          </div>
          <Link href="/ict" className="hover:text-black/70">ICT Center</Link>
          <Link href="/news" className="hover:text-black/70">News</Link>
          <Link href="/login" className="border px-4 py-2 rounded hover:bg-white hover:text-[rgb(3,158,29)] transition">Portal</Link>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden px-8 pb-4 flex flex-col gap-4 bg-[rgb(20,20,52)]">
          <Link href="/" onClick={toggleNavbar}>Home</Link>
          <button onClick={() => setIsAboutOpen((v) => !v)} className="text-left">About ▾</button>
          {isAboutOpen && (
            <div className="pl-4 flex flex-col gap-2">
              <Link href="/about/history" onClick={toggleNavbar}>History</Link>
              <Link href="/about/vision-mission" onClick={toggleNavbar}>Vision &amp; Mission</Link>
              <Link href="/about/leadership" onClick={toggleNavbar}>Leadership</Link>
              <Link href="/about/campuses" onClick={toggleNavbar}>Campuses</Link>
            </div>
          )}
          <button onClick={() => setIsAcademicsOpen((v) => !v)} className="text-left">Academics ▾</button>
          {isAcademicsOpen && (
            <div className="pl-4 flex flex-col gap-2">
              <button onClick={() => setIsProgramsOpen((v) => !v)} className="text-left">Programs ▾</button>
              {isProgramsOpen && (
                <div className="pl-4 flex flex-col gap-2">
                  <Link href="/academics/programs/nce-full-time" onClick={toggleNavbar}>NCE (Full-time)</Link>
                  <Link href="/academics/programs/nce-part-time" onClick={toggleNavbar}>NCE (Part-time)</Link>
                  <Link href="/academics/programs/degree" onClick={toggleNavbar}>Degree</Link>
                  <Link href="/academics/programs/post-graduate" onClick={toggleNavbar}>Post-Graduate</Link>
                </div>
              )}
              <Link href="/schools" onClick={toggleNavbar}>Schools</Link>
            </div>
          )}
          <Link href="/admission" onClick={toggleNavbar}>Admission</Link>
          <Link href="/ict" onClick={toggleNavbar}>ICT Center</Link>
          <Link href="/news" onClick={toggleNavbar}>News</Link>
          <Link href="/login" onClick={toggleNavbar} className="border px-4 py-2 rounded self-center w-1/2 text-center">Portal</Link>
        </div>
      )}
    </nav>
  );
}


