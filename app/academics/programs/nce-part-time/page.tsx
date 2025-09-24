import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";

export default function NcePartTimePage() {
  const artsAndSocial: string[] = [
    "ISS/SOS",
    "SOS (DM)",
    "CRS/SOS",
    "CRS/ENGLISH",
  ];

  const languages: string[] = [
    "ARABIC/HAUSA",
    "ARABIC/ISS",
    "ENGLISH/FRENCH",
    "ENGLISH/HAUSA",
    "ENGLISH/IGBO",
    "ENGLISH/ISS",
    "ENGLISH/SOS",
    "ENGLISH/YORUBA",
    "FRENCH/HAUSA",
    "FRENCH/IGBO",
    "FRENCH/YORUBA",
    "HAUSA/IGBO",
    "HAUSA/ISS",
    "HAUSA/SOS",
    "HAUSA/YORUBA",
  ];

  const sciences: string[] = [
    "BIO/CHEM",
    "BIO/ISC",
    "CHEM/ISC",
    "CSC/PHY",
    "CSC/ISC",
    "CSC/ISC",
    "CSC/BIO",
    "CSC/CHEM",
    "ISC (DM)",
    "ISC/PHY",
    "ISC/MATHS",
    "MATHS/PHY",
    "PHE (DM)",
  ];

  const vocational: string[] = [
    "AGRICULTURAL EDUCATION (DM)",
    "BUSSINESS EDUCATION (DM)",
    "F. A. A. (DM)",
    "HOMEC (DM)",
  ];

  const eccePed: string[] = [
    "E.C.C.E. (DM)",
    "P.E.D. (DM)",
  ];

  const adultNonFormal: string[] = [
    "ANF (DM)",
  ];

  const renderTable = (title: string, items: string[]) => (
    <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] overflow-hidden bg-white/70 dark:bg-white/5">
      <div className="px-4 py-3 bg-black/5 dark:bg-white/10 font-semibold">{title}</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80">
            <tr>
              <th className="text-left px-4 py-2 w-16">#</th>
              <th className="text-left px-4 py-2">Programme</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {items.map((name, idx) => (
              <tr key={name} className="hover:bg-black/5 dark:hover:bg-white/10">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 py-12 text-black/80 dark:text-white/80">
        <h1 className="text-2xl md:text-3xl font-semibold">List of NCE Programmes (Part-time)</h1>
        <p className="mt-2 mb-8">Below are the available programmes grouped by schools.</p>
        <div className="space-y-8">
          {renderTable("School of Arts and Social Sciences", artsAndSocial)}
          {renderTable("School of Languages", languages)}
          {renderTable("School of Sciences", sciences)}
          {renderTable("School of Vocational and Technical Education", vocational)}
          {renderTable("School of ECCE/PED", eccePed)}
          {renderTable("School of Adult and Non-Formal Education", adultNonFormal)}
        </div>
      </section>
      <Footer />
    </div>
  );
}


