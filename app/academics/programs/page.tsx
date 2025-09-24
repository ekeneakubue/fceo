import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

export default function ProgramsPage() {
  return (
    <div>
      <Navbar />
      <section className="relative w-full md:h-[40vh] h-[28vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/home-banner.jpg')" }}>
          <div className="w-full h-full bg-[rgba(20,20,52,0.55)] grid place-items-center text-center px-6">
            <h1 className="text-white text-3xl md:text-5xl font-bold">Programs</h1>
          </div>
        </div>
      </section>
      <main className="max-w-6xl mx-auto px-6 py-12 text-black/80 dark:text-white/80">
        <p className="text-lg">Content coming soon.</p>
      </main>
      <Footer />
    </div>
  );
}


