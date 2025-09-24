"use client";
import React, { useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import HeroSlider from "./components/hero/HeroSlider";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
    AOS.refresh();
  }, []);
  return (
    <div>
      <Navbar />
      <HeroSlider
        autoPlayMs={5000}
        slides={[
          {
            imageUrl: "/images/home-banner.jpg",
            heading: "Welcome to Federal College of Education, Ofeme Ohuhu",
            lines: [
              "To Educate to Liberate the Mind",
              "Committed to Excellence in Teacher Education",
            ],
          },
          {
            imageUrl: "/images/1.jfif",
            heading: "Quality Teacher Education",
            lines: ["Shaping the future of classrooms", "Inspiring excellence"],
          },
          {
            imageUrl: "/images/2.jfif",
            heading: "Community and Impact",
            lines: ["Building strong communities", "Driving positive change"],
          },
        ]}
      />
      <Footer />
    </div>
  );
}
