"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ScrollTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/staff-login") return null;

  if (!isVisible) return null;

  return (
    <button
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[rgb(3,158,29)] text-white shadow-lg grid place-items-center hover:opacity-90 z-50"
    >
      ↑
    </button>
  );
}


