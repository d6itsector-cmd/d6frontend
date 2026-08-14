import "./WhyWebsite.css";
import {
  FaMobileAlt,
  FaBolt,
  FaSearch,
  FaShieldAlt,
  FaLaptopCode,
  FaChartLine,
} from "react-icons/fa";

const WhyWebsite = () => {
  const features = [
    {
      icon: <FaMobileAlt />,
      title: "Responsive Design",
      description:
        "Your website looks perfect on desktops, tablets, and mobile devices.",
    },
    {
      icon: <FaBolt />,
      title: "Fast Loading Speed",
      description:
        "Optimized performance for better user experience and improved conversions.",
    },
    {
      icon: <FaSearch />,
      title: "SEO Friendly",
      description:
        "Built with SEO best practices to help your website rank higher on search engines.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Website",
      description:
        "Advanced security measures to protect your website and customer data.",
    },
    {
      icon: <FaLaptopCode />,
      title: "Custom Development",
      description:
        "Tailor-made solutions designed to meet your business goals and requirements.",
    },
    {
      icon: <FaChartLine />,
      title: "Business Growth",
      description:
        "Generate more leads and grow your business with a professional online presence.",
    },
  ];

  return (
    <section className="why-website">
      <div className="why-website-container">

        <div className="why-header">
          <span className="section-tag">WHY CHOOSE US</span>

          <h2>
            Why Invest in
            <span> Website Development?</span>
          </h2>

          <p>
            A professional website is your digital storefront. We build
            high-performing websites that enhance your brand, improve customer
            experience, and drive measurable business growth.
          </p>
        </div>

        <div className="why-grid">
          {features.map((feature, index) => (
            <div className="why-card" key={index}>

              <div className="why-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyWebsite;