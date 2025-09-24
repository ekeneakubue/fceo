import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

export default function SchoolsPage() {
  return (
    <div>
      <Navbar />
      <section className="relative w-full md:h-[50vh] h-[30vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/home-banner.jpg')" }}
        >
          <div className="w-full h-full bg-[rgba(20,20,52,0.55)] flex items-center justify-center text-center px-6">
            <h1 className="text-white text-3xl md:text-5xl font-bold">Schools</h1>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "School of Primary Education Art and Social Sciences",
            "School of Primary Education Sciences",
            "School of Primary Education Languages",
            "School of Primary Education Vocational and Technology Education",
            "School of Education",
            "School of Early Childhood Care, Primary and Adult & Non-formal Education.",
            "School of General Studies",
          ].map((title) => (
            <div key={title} className="rounded-xl overflow-hidden border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5">
              <div className="aspect-video bg-black/10 grid place-items-center text-black/60 dark:text-white/60 text-sm px-4 text-center">
                Image Placeholder
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-black/70 dark:text-white/70 mt-1">Explore programmes, departments, and admission requirements.</p>
                <a href="#" className="mt-3 inline-block text-sm font-medium underline underline-offset-4">Learn more</a>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}


