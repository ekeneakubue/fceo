import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Units from "../components/units/Units";

export default function IctPage() {
  return (
    <div>
      <Navbar />
      <Units
        unitLeader="Director"
        item1="Home"
        item2="Contact Us"
        option1="Main Office"
        option2="Customer Care"
        option3="Portal Unit"
        option4="Website Unit"
        homeLink="/admission"
        brandText="ICT/Innovation Unit"
        brandName="ICT/Innovation Unit, Federal College of Education, Ofeme Ohuhu, Umuahia"
        statement={
          "The ICT Unit of the College is generally charged with the responsibilities \n            of deploying ICT infrastructure and services for administration, teaching, research and \n            learning to the College at large.\n            \n            The ICT Unit is also responsible for the development and management of the College \n            ICT policies, strategies and standards. It also provides technical support for the students and Staff"
        }
        vision={
          "We aspire to build an organization that focuses on People, Process and Technology \n            evidenced by Committed and skilled staff accountable to College of education, Ofeme's mission; and \n            serving faculty and students;\n            Simple processes making it easy for staff and students to work, and deliver results; and \n            Innovative technology to enhance teaching and learning in Federal College of Education, Ofeme Ohuhu, Umuahia"
        }
        mission={
          "To assure FECO Ofeme leadership in IT, we deliver academic excellence \n            through innovative technology and we strive to make it easier for faculty, students, and \n            staff to teach, research, learn, and work through the effective use of information technology."
        }
        unitPhone="+234 803 000 0000"
        unitEmail="ict@fceo.edu.ng"
      />
      <Footer />
    </div>
  );
}


