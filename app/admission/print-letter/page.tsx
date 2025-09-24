import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

export default function PrintAdmissionLetterPage() {
  return (
    <div>
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-2xl md:text-3xl font-semibold">Print Admission Letter</h1>
        <p className="text-black/80 dark:text-white/80 mt-2">Provide your credentials to retrieve and print your admission letter.</p>
        <div className="mt-6 grid gap-4 max-w-md">
          <input className="px-3 py-2 rounded border border-black/20 bg-white text-black" placeholder="Reg No" />
          <button className="h-11 rounded bg-[rgb(3,158,29)] text-white font-medium">Retrieve Letter</button>
        </div>
      </section>
      <Footer />
    </div>
  );
}


