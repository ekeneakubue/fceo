import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";

export default function DegreePage() {
  const programmes: string[] = [
    "B.Sc Biology",
    "B.Sc Maths",
    "B.Sc Chemistry",
    "B.Sc Physics",
    "B.Sc Physical Health Education",
    "B.Ed Hausa",
    "B.Ed Islamic Studies",
    "B.Ed English",
    "B.Ed Arabic",
  ];

  return (
    <div>
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 py-12 text-black/80 dark:text-white/80">
        <h1 className="text-2xl md:text-3xl font-semibold">Degree Programme</h1>
        <p className="mt-2">Explore our degree offerings:</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programmes.map((title) => (
            <div key={title} className="rounded-xl overflow-hidden border border-black/[.08] dark:border-white/[.145] bg-white/70 dark:bg-white/5">
              <div className="aspect-video bg-black/10 grid place-items-center text-black/60 dark:text-white/60 text-sm px-4 text-center">
                Image Placeholder
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-black/70 dark:text-white/70 mt-1">Brief description coming soon.</p>
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


