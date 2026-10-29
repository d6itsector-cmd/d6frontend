import { Link } from "react-router-dom";

import {
  FaSearch,
  FaBullhorn,
  FaShareAlt,
  FaLaptopCode,
  FaEnvelope,
  FaCheck,
} from "react-icons/fa";

import seoImage from "../../assets/whyseo.jpg";
import googleAdsImage from "../../assets/googleads.jpeg";
import socialImage from "../../assets/socialmedia.jpg";
import websiteImage from "../../assets/websitedev.png";
import emailImage from "../../assets/emailmarketing.jpg";

import "./ServicesList.css";

const services = [
  {
    title: "SEO",
    eyebrow: "Search Engine Optimization",
    description:
      "Improve your search rankings, attract high-quality traffic, and generate more qualified leads with our result-driven SEO services. We help startups and growing businesses build a strong online presence through ethical, data-driven optimization strategies that deliver measurable results.",
    icon: <FaSearch />,
    image: seoImage,
    // diagrams on white are shown whole; photos fill the frame
    contain: true,
    path: "/services/seo",
    // key offerings, as listed on each service's own page
    features: ["Keyword Research", "On-Page SEO", "Technical SEO", "Local SEO", "Content Optimization", "Link Building"],
  },
  {
    title: "Google Ads",
    eyebrow: "Pay-Per-Click Advertising",
    description:
      "Reach customers at the perfect moment with high-performing Google Ads campaigns. We create data-driven PPC strategies that increase website traffic, generate quality leads, and maximize your return on investment.",
    icon: <FaBullhorn />,
    image: googleAdsImage,
    contain: true,
    path: "/services/google-ads",
    features: ["Search Ads", "Shopping Ads", "Display Ads", "YouTube Ads", "App Promotion Ads", "Campaign Optimization"],
  },
  {
    title: "Social Media Marketing",
    eyebrow: "Brand Awareness & Engagement",
    description:
      "Connect with your audience, increase brand awareness, and drive meaningful business growth through strategic social media marketing across the platforms your customers use every day.",
    icon: <FaShareAlt />,
    image: socialImage,
    contain: true,
    path: "/services/social-media",
    features: ["Instagram Marketing", "Facebook Marketing", "LinkedIn Marketing", "Paid Advertising", "Content Creation", "Analytics & Reporting"],
  },
  {
    title: "Website Development",
    eyebrow: "Modern Business Websites",
    description:
      "We create responsive, fast, secure, and SEO-friendly websites that help your business establish a strong online presence, attract more visitors, and turn them into customers.",
    icon: <FaLaptopCode />,
    image: websiteImage,
    contain: true,
    path: "/services/web-development",
    features: ["Responsive Website Development", "E-Commerce Development", "React Web Applications", "UI/UX Design", "Performance Optimization", "Website Maintenance"],
  },
  {
    title: "Email Marketing",
    eyebrow: "Campaigns That Convert",
    description:
      "Build meaningful customer relationships with personalized email campaigns. Increase engagement, generate quality leads, and drive more sales through data-driven email marketing strategies.",
    icon: <FaEnvelope />,
    image: emailImage,
    path: "/services/email-marketing",
    features: ["Email Campaign Strategy", "Newsletter Design", "Email Automation", "Lead Nurturing", "Promotional Campaigns", "Analytics & Reporting"],
  },
];

const ServicesList = () => {
  return (
    <div className="svc-page">

      {/* Page heading */}

      <header className="svc-intro">
        <div className="svc-intro-inner">
          <span className="svc-badge">OUR SERVICES</span>

          <h1>
            Digital Marketing Services for
            <span> Growing Businesses</span>
          </h1>

          <p>
            From search visibility to high-converting websites, explore the
            services we offer to help your business attract, engage, and
            convert more customers.
          </p>

          <nav className="svc-jump" aria-label="Services on this page">
            {services.map((service, index) => (
              <a key={service.path} href={`#svc-${index}`}>
                {service.icon}
                {service.title}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* One row per service; image side alternates */}

      {services.map((service, index) => (
        <section
          key={service.path}
          id={`svc-${index}`}
          className={`svc-section ${index % 2 ? "svc-section--alt" : ""}`}
          aria-labelledby={`svc-title-${index}`}
        >
          <div className="svc-row">

            <div className="svc-text">
              <div className="svc-heading">
                <span className="svc-icon">{service.icon}</span>

                <div>
                  <span className="svc-eyebrow">{service.eyebrow}</span>
                  <h2 id={`svc-title-${index}`}>{service.title}</h2>
                </div>
              </div>

              <p className="svc-description">{service.description}</p>

              <ul className="svc-features" aria-label={`${service.title} includes`}>
                {service.features.map((feature) => (
                  <li key={feature}>
                    <FaCheck aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="svc-actions">
                <Link to={service.path} className="svc-btn svc-btn--primary">
                  Explore {service.title}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div
              className={`svc-media ${service.contain ? "svc-media--contain" : ""}`}
            >
              <img
                src={service.image}
                alt={`${service.title} illustration`}
                loading={index < 2 ? "eager" : "lazy"}
              />
            </div>

          </div>
        </section>
      ))}

    </div>
  );
};

export default ServicesList;
