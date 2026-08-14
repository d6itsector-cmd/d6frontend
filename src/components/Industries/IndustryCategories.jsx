import "./IndustryCategories.css";
import { useConsultation } from "../../context/ConsultationContext";
import {
  FaRocket,
  FaShoppingCart,
  FaHeartbeat,
  FaGraduationCap,
  FaHome,
  FaUniversity,
  FaIndustry,
  FaHotel,
} from "react-icons/fa";

const industries = [
  {
    icon: <FaRocket />,
    title: "Startups",
    description:
      "Helping startups build their brand, generate leads, and scale faster through digital marketing.",
  },
  {
    icon: <FaShoppingCart />,
    title: "E-Commerce",
    description:
      "Increase online sales with SEO, Google Ads, and conversion-focused marketing.",
  },
  {
    icon: <FaHeartbeat />,
    title: "Healthcare",
    description:
      "Reach more patients and build trust with ethical healthcare marketing strategies.",
  },
  {
    icon: <FaGraduationCap />,
    title: "Education",
    description:
      "Increase student admissions through targeted digital marketing campaigns.",
  },
  {
    icon: <FaHome />,
    title: "Real Estate",
    description:
      "Generate high-quality property leads and improve online visibility.",
  },
  {
    icon: <FaUniversity />,
    title: "Finance",
    description:
      "Build credibility and acquire quality financial clients through digital channels.",
  },
  {
    icon: <FaIndustry />,
    title: "Manufacturing",
    description:
      "Expand your B2B reach and generate qualified business inquiries.",
  },
  {
    icon: <FaHotel />,
    title: "Hospitality",
    description:
      "Increase bookings and customer engagement with hospitality marketing.",
  },
];

const IndustryCategories = () => {
  const { openConsultation } = useConsultation();

  return (
    <section className="industry-section">

      <div className="industry-heading">

        <span>INDUSTRIES WE SERVE</span>

        <h2>
          Digital Marketing Solutions
          <br />
          For Every Industry
        </h2>

        <p>
          We understand that every industry has unique challenges.
          Our customized digital marketing strategies help businesses
          grow, attract customers, and achieve measurable success.
        </p>

      </div>

      <div className="industry-grid">

        {industries.map((industry, index) => (

          <div className="industry-card" key={index}>

            <div className="industry-icon">
              {industry.icon}
            </div>

            <h3>{industry.title}</h3>

            <p>{industry.description}</p>

            <button onClick={openConsultation}>
              Learn More →
            </button>

          </div>

        ))}

      </div>

    </section>
  );
};

export default IndustryCategories;