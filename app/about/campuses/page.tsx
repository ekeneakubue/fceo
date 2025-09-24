import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

export default function CampusesPage() {
  return (
    <div>
      <Navbar />
      <section className="relative w-full md:h-[40vh] h-[28vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/home-banner.jpg')" }}>
          <div className="w-full h-full bg-[rgba(20,20,52,0.55)] grid place-items-center text-center px-6">
            <h1 className="text-white text-3xl md:text-5xl font-bold">Campuses</h1>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Main Campus", img: "/images/3.jfif" },
            { title: "Annex Campus", img: "/images/4.jfif" },
            { title: "ICT Building", img: "/images/ict/1.png" },
          ].map((c) => (
            <div key={c.title} className="rounded-xl overflow-hidden border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5">
              <div className="aspect-video">
                <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-black/70 dark:text-white/70">Brief description coming soon.</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}


