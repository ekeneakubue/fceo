import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

export default function AboutHistoryPage() {
  return (
    <div>
      <Navbar />
      <section className="relative w-full md:h-[40vh] h-[28vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/home-banner.jpg')" }}>
          <div className="w-full h-full bg-[rgba(20,20,52,0.55)] grid place-items-center text-center px-6">
            <h1 className="text-white text-3xl md:text-5xl font-bold">Our History</h1>
          </div>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-12">
        <ol className="relative border-s border-black/10 dark:border-white/20">
          {[
            { year: "2019", text: "Founding of the College" },
            { year: "2021", text: "First cohort admitted" },
            { year: "2023", text: "Launch of ICT/Innovation Unit" },
            { year: "2025", text: "Accreditation of new programmes" },
          ].map((item) => (
            <li key={item.year} className="mb-10 ms-6">
              <span className="absolute -start-5 flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(3,158,29)] text-white text-xs font-semibold">{item.year}</span>
              <h3 className="text-lg font-semibold mt-1 ml-2">{item.text}</h3>
              <p className="text-sm text-black/70 dark:text-white/70 mt-1 ml-2">Brief description goes here describing the milestone and its impact.</p>
            </li>
          ))}
        </ol>
      </section>
      <Footer />
    </div>
  );
}


