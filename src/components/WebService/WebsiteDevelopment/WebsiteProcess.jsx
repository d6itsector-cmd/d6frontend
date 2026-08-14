import "./WebsiteProcess.css";
import {
  FaLightbulb,
  FaDraftingCompass,
  FaLaptopCode,
  FaGlobe,
} from "react-icons/fa";

const WebsiteProcess = () => {
  const process = [
    {
      number: "01",
      icon: <FaLightbulb />,
      title: "Project Discovery",
      description:
        "We understand your business goals, target audience, and project requirements to create the perfect development strategy.",
    },
    {
      number: "02",
      icon: <FaDraftingCompass />,
      title: "UI/UX Design",
      description:
        "Our designers create attractive wireframes and user-friendly interfaces that provide an engaging experience.",
    },
    {
      number: "03",
      icon: <FaLaptopCode />,
      title: "Development & Integration",
      description:
        "We develop fast, responsive, secure, and scalable websites using the latest web technologies and best coding practices.",
    },
    {
      number: "04",
      icon: <FaGlobe />,
      title: "Launch & Support",
      description:
        "After thorough testing, we deploy your website successfully and provide ongoing maintenance and technical support.",
    },
  ];

  return (
    <section className="website-process">
      <div className="website-process-container">

        <div className="process-header">

          <span className="section-tag">
            OUR PROCESS
          </span>

          <h2>
            Our Website Development
            <span> Process</span>
          </h2>

          <p>
            We follow a structured development approach to deliver modern,
            responsive, and high-performing websites that help your business
            grow online.
          </p>

        </div>

        <div className="process-grid">

          {process.map((step, index) => (
            <div className="process-card" key={index}>

              <div className="process-number">
                {step.number}
              </div>

              <div className="process-icon">
                {step.icon}
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default WebsiteProcess;