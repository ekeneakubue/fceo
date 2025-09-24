import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

export default function VisionMissionPage() {
  return (
    <div>
      <Navbar />
      <section className="relative w-full md:h-[40vh] h-[28vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/home-banner.jpg')" }}>
          <div className="w-full h-full bg-[rgba(20,20,52,0.55)] grid place-items-center text-center px-6">
            <h1 className="text-white text-3xl md:text-5xl font-bold">Vision &amp; Mission</h1>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 bg-white/70 dark:bg-white/5">
          <h2 className="text-xl font-semibold">Vision</h2>
          <ul className="mt-3 space-y-2 text-sm text-black/80 dark:text-white/80 list-disc ps-5">
            <li>Transform education through evidence-based teaching and innovation.</li>
            <li>Develop leaders who advance equity and inclusion.</li>
            <li>Strengthen communities through impactful partnerships.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 bg-white/70 dark:bg-white/5">
          <h2 className="text-xl font-semibold">Mission</h2>
          <ul className="mt-3 space-y-2 text-sm text-black/80 dark:text-white/80 list-disc ps-5">
            <li>Prepare excellent teachers, counselors, and administrators.</li>
            <li>Promote research that improves learning outcomes.</li>
            <li>Serve society through lifelong learning and service.</li>
          </ul>
        </div>
      </section>
      <Footer />
    </div>
  );
}


