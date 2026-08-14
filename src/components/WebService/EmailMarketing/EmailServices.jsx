import "./EmailServices.css";
import {
  FaEnvelopeOpenText,
  FaPaintBrush,
  FaRobot,
  FaUsers,
  FaBullhorn,
  FaChartLine,
} from "react-icons/fa";

const EmailServices = () => {
  const services = [
    {
      icon: <FaEnvelopeOpenText />,
      title: "Email Campaign Strategy",
      description:
        "Create personalized email strategies that align with your business goals and customer journey.",
    },
    {
      icon: <FaPaintBrush />,
      title: "Newsletter Design",
      description:
        "Design responsive and visually engaging newsletters that strengthen your brand identity.",
    },
    {
      icon: <FaRobot />,
      title: "Email Automation",
      description:
        "Automate welcome emails, follow-ups, abandoned cart reminders, and drip campaigns.",
    },
    {
      icon: <FaUsers />,
      title: "Lead Nurturing",
      description:
        "Build trust with prospects using targeted email sequences that guide them through the sales funnel.",
    },
    {
      icon: <FaBullhorn />,
      title: "Promotional Campaigns",
      description:
        "Increase sales with product launches, special offers, seasonal promotions, and event campaigns.",
    },
    {
      icon: <FaChartLine />,
      title: "Analytics & Reporting",
      description:
        "Track open rates, click-through rates, conversions, and campaign performance with detailed reports.",
    },
  ];

  return (
    <section className="email-services">
      <div className="email-services-container">

        <div className="email-services-header">

          <span className="section-tag">
            OUR SERVICES
          </span>

          <h2>
            Complete <span>Email Marketing Solutions</span>
          </h2>

          <p>
            We provide end-to-end email marketing services that help
            businesses engage customers, generate leads, and increase revenue.
          </p>

        </div>

        <div className="email-services-grid">

          {services.map((service, index) => (
            <div className="email-service-card" key={index}>

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

export default EmailServices;