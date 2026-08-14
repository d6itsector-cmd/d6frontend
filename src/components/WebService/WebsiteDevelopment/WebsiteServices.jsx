import "./WebsiteServices.css";
import {
  FaLaptopCode,
  FaShoppingCart,
  FaReact,
  FaPalette,
  FaRocket,
  FaTools,
} from "react-icons/fa";

const WebsiteServices = () => {
  const services = [
    {
      icon: <FaLaptopCode />,
      title: "Responsive Website Development",
      description:
        "Modern, mobile-friendly websites that provide a seamless experience across all devices.",
    },
    {
      icon: <FaShoppingCart />,
      title: "E-Commerce Development",
      description:
        "Powerful online stores with secure payment gateways and easy product management.",
    },
    {
      icon: <FaReact />,
      title: "React Web Applications",
      description:
        "Fast, scalable, and interactive web applications built using the latest React technology.",
    },
    {
      icon: <FaPalette />,
      title: "UI/UX Design",
      description:
        "Creative, user-focused interface designs that improve engagement and customer satisfaction.",
    },
    {
      icon: <FaRocket />,
      title: "Performance Optimization",
      description:
        "Improve website speed, Core Web Vitals, and overall performance for better user experience.",
    },
    {
      icon: <FaTools />,
      title: "Website Maintenance",
      description:
        "Regular updates, security monitoring, backups, and technical support to keep your website running smoothly.",
    },
  ];

  return (
    <section className="website-services">
      <div className="website-services-container">

        <div className="services-header">
          <span className="section-tag">
            OUR SERVICES
          </span>

          <h2>
            Complete Website
            <span> Development Solutions</span>
          </h2>

          <p>
            We build high-quality websites tailored to your business needs,
            combining attractive design, robust functionality, and exceptional
            performance.
          </p>
        </div>

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

export default WebsiteServices;