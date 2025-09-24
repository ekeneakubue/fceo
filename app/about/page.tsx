import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      <Navbar />
      {/* Hero */}
      <section className="relative w-full md:h-[50vh] h-[30vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/home-banner.jpg')" }}>
          <div className="w-full h-full bg-[rgba(20,20,52,0.55)] grid place-items-center text-center px-6">
            <div>
              <p className="text-white/80 uppercase tracking-widest text-xs mb-2">About</p>
              <h1 className="text-white text-3xl md:text-5xl font-bold">Our College at a Glance</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Subnav */}
      <nav className="bg-white dark:bg-black/20 border-y border-black/[.08] dark:border-white/[.14]">
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
          <ul className="flex gap-6 py-3 text-sm whitespace-nowrap">
            <li><Link className="hover:underline" href="/about/history">History</Link></li>
            <li><Link className="hover:underline" href="/about/vision-mission">Vision &amp; Mission</Link></li>
            <li><Link className="hover:underline" href="/about/leadership">Leadership</Link></li>
            <li><Link className="hover:underline" href="/about/campuses">Campuses</Link></li>
          </ul>
        </div>
      </nav>

      {/* Overview */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Who We Are</h2>
          <p className="text-black/80 dark:text-white/80 leading-relaxed">
            Federal College of Education, Ofeme Ohuhu prepares the next generation of educators,
            leaders, and innovators. We combine rigorous academics with community-centered practice
            to improve teaching and learning outcomes for all.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 bg-white/70 dark:bg-white/5">
              <h3 className="font-semibold text-lg">Mission</h3>
              <p className="mt-2 text-sm text-black/80 dark:text-white/80">To educate and inspire through excellence in teacher education, research, and service.</p>
            </div>
            <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 bg-white/70 dark:bg-white/5">
              <h3 className="font-semibold text-lg">Vision</h3>
              <p className="mt-2 text-sm text-black/80 dark:text-white/80">To be a transformative hub where educators lead change in classrooms and communities.</p>
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 bg-white/70 dark:bg-white/5">
            <h3 className="font-semibold text-lg">Fast Facts</h3>
            <ul className="mt-3 text-sm space-y-2 text-black/80 dark:text-white/80">
              <li>• 10+ academic programmes</li>
              <li>• 4,000+ students</li>
              <li>• 150+ faculty & staff</li>
              <li>• Active community partnerships</li>
            </ul>
          </div>
        </aside>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-semibold">Our Values</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {["Excellence", "Equity", "Integrity", "Innovation"].map((v) => (
            <div key={v} className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-6 bg-white/70 dark:bg-white/5">
              <div className="text-2xl">🎓</div>
              <h3 className="mt-2 font-semibold">{v}</h3>
              <p className="mt-1 text-sm text-black/80 dark:text-white/80">We strive to embody {v.toLowerCase()} in our teaching, research, and service.</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}


