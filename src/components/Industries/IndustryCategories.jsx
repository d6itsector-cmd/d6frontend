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

// Photography: Unsplash (Unsplash Licence), see src/assets/photos/CREDITS.md
import startupsPhoto from "../../assets/photos/industry-startups.webp";
import ecommercePhoto from "../../assets/photos/industry-ecommerce.webp";
import healthcarePhoto from "../../assets/photos/industry-healthcare.webp";
import educationPhoto from "../../assets/photos/industry-education.webp";
import realEstatePhoto from "../../assets/photos/industry-real-estate.webp";
import financePhoto from "../../assets/photos/industry-finance.webp";
import manufacturingPhoto from "../../assets/photos/industry-manufacturing.webp";
import hospitalityPhoto from "../../assets/photos/industry-hospitality.webp";

const industries = [
  {
    icon: <FaRocket />,
    title: "Startups",
    photo: startupsPhoto,
    photoAlt: "Open-plan startup office with team members working at desks",
    description:
      "Helping startups build their brand, generate leads, and scale faster through digital marketing.",
  },
  {
    icon: <FaShoppingCart />,
    title: "E-Commerce",
    photo: ecommercePhoto,
    photoAlt: "Customer paying by card at a modern retail checkout",
    description:
      "Increase online sales with SEO, Google Ads, and conversion-focused marketing.",
  },
  {
    icon: <FaHeartbeat />,
    title: "Healthcare",
    photo: healthcarePhoto,
    photoAlt: "Clinician typing on a laptop beside a stethoscope",
    description:
      "Reach more patients and build trust with ethical healthcare marketing strategies.",
  },
  {
    icon: <FaGraduationCap />,
    title: "Education",
    photo: educationPhoto,
    photoAlt: "Bright classroom with rows of desks facing a chalkboard",
    description:
      "Increase student admissions through targeted digital marketing campaigns.",
  },
  {
    icon: <FaHome />,
    title: "Real Estate",
    photo: realEstatePhoto,
    photoAlt: "House keys on a keyring beside a small model house",
    description:
      "Generate high-quality property leads and improve online visibility.",
  },
  {
    icon: <FaUniversity />,
    title: "Finance",
    photo: financePhoto,
    photoAlt: "Professional signing financial documents at a desk",
    description:
      "Build credibility and acquire quality financial clients through digital channels.",
  },
  {
    icon: <FaIndustry />,
    title: "Manufacturing",
    photo: manufacturingPhoto,
    photoAlt: "Engineer working on a laptop beside industrial equipment",
    description:
      "Expand your B2B reach and generate qualified business inquiries.",
  },
  {
    icon: <FaHotel />,
    title: "Hospitality",
    photo: hospitalityPhoto,
    photoAlt: "Resort terrace with sun loungers beside a swimming pool",
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

            <img
              className="industry-photo"
              src={industry.photo}
              alt={industry.photoAlt}
              width="800"
              height="500"
              loading="lazy"
              decoding="async"
            />

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