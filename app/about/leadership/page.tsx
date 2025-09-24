import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

export default function LeadershipPage() {
  return (
    <div>
      <Navbar />
      <section className="relative w-full md:h-[40vh] h-[28vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/home-banner.jpg')" }}>
          <div className="w-full h-full bg-[rgba(20,20,52,0.55)] grid place-items-center text-center px-6">
            <h1 className="text-white text-3xl md:text-5xl font-bold">Leadership</h1>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Provost", img: "/images/officers/provost.jpg" },
            { name: "Registrar", img: "/images/officers/registrar.jpg" },
            { name: "Bursar", img: "/images/officers/bursar.jpg" },
            { name: "Librarian", img: "/images/officers/liberian.jpg" },
          ].map((p) => (
            <div key={p.name} className="rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5 overflow-hidden">
              <div className="aspect-[4/3] bg-black/10">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-black/70 dark:text-white/70">Profile coming soon.</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}


