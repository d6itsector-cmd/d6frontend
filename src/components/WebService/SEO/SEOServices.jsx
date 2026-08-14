import "./SEOServices.css";
import {
  FaSearch,
  FaFileAlt,
  FaCogs,
  FaMapMarkerAlt,
  FaPenNib,
  FaLink,
} from "react-icons/fa";

const services = [
  {
    icon: <FaSearch />,
    title: "Keyword Research",
    description:
      "Find the right keywords your customers are searching for to improve visibility and attract qualified traffic.",
  },
  {
    icon: <FaFileAlt />,
    title: "On-Page SEO",
    description:
      "Optimize titles, meta descriptions, headings, URLs, and content to improve search rankings.",
  },
  {
    icon: <FaCogs />,
    title: "Technical SEO",
    description:
      "Enhance website speed, mobile responsiveness, indexing, and overall technical performance.",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Local SEO",
    description:
      "Increase your visibility in local search results and attract customers from your target location.",
  },
  {
    icon: <FaPenNib />,
    title: "Content Optimization",
    description:
      "Create and optimize valuable content that engages users and performs well in search engines.",
  },
  {
    icon: <FaLink />,
    title: "Link Building",
    description:
      "Build high-quality backlinks that improve your website's authority and credibility.",
  },
];

const SEOServices = () => {
  return (
    <section className="seo-services">
      <div className="seo-services-container">

        <span className="section-tag">
          OUR SEO SERVICES
        </span>

        <h2>
          Everything You Need to
          <span> Rank Higher</span>
        </h2>

        <p className="section-description">
          Our SEO solutions are designed to improve your online visibility,
          increase organic traffic, and help your business achieve sustainable
          growth.
        </p>

        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>

              <div className="service-icon">
                {service.icon}
              </div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SEOServices;