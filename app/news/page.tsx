import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Image from "next/image";

export default function NewsPage() {
  const posts = [
    { id: 1, title: "Matriculation Ceremony Announced", date: "Aug 12, 2025", img: "/images/5.jfif" },
    { id: 2, title: "New ICT Center Unveiled", date: "Jul 28, 2025", img: "/images/ict/1.png" },
    { id: 3, title: "Scholarship Opportunities", date: "Jul 05, 2025", img: "/images/2.jfif" },
    { id: 4, title: "Community Outreach Program", date: "Jun 18, 2025", img: "/images/3.jfif" },
  ];
  return (
    <div>
      <Navbar />
      <section className="relative w-full md:h-[40vh] h-[28vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/home-banner.jpg')" }}>
          <div className="w-full h-full bg-[rgba(20,20,52,0.55)] grid place-items-center text-center px-6">
            <h1 className="text-white text-3xl md:text-5xl font-bold">News</h1>
          </div>
        </div>
      </section>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.id} className="rounded-xl overflow-hidden border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5">
              <div className="aspect-video bg-black/10 relative">
                <Image src={p.img} alt={p.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <p className="text-xs text-black/60 dark:text-white/60">{p.date}</p>
                <h3 className="mt-1 font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-black/70 dark:text-white/70">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Read more...</p>
                <a className="mt-3 inline-block text-sm font-medium underline underline-offset-4" href="#">Read more</a>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}


