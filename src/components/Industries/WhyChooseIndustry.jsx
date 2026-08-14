import "./WhyChooseIndustry.css";
import {
  FaBullseye,
  FaChartLine,
  FaUsers,
  FaLightbulb,
  FaHandshake,
  FaHeadset,
} from "react-icons/fa";

const features = [
  {
    icon: <FaBullseye />,
    title: "Industry-Focused Strategies",
    description:
      "We develop customized marketing strategies tailored to the unique goals and challenges of every industry.",
  },
  {
    icon: <FaChartLine />,
    title: "ROI-Driven Campaigns",
    description:
      "Every campaign is optimized to maximize traffic, leads, and return on investment.",
  },
  {
    icon: <FaUsers />,
    title: "Experienced Team",
    description:
      "Our experts combine creativity, technology, and marketing to deliver measurable results.",
  },
  {
    icon: <FaLightbulb />,
    title: "Creative Solutions",
    description:
      "We create innovative campaigns that help businesses stand out in competitive markets.",
  },
  {
    icon: <FaHandshake />,
    title: "Long-Term Partnership",
    description:
      "We believe in building lasting relationships by supporting your business growth at every stage.",
  },
  {
    icon: <FaHeadset />,
    title: "Dedicated Support",
    description:
      "Our team is always available to provide guidance, updates, and continuous campaign improvements.",
  },
];

const WhyChooseIndustry = () => {
  return (
    <section className="why-industry">

      <div className="why-header">
        <span>WHY CHOOSE US</span>

        <h2>
          Your Trusted Digital
          <br />
          Marketing Partner
        </h2>

        <p>
          We work closely with businesses across multiple industries,
          delivering customized digital marketing solutions that
          generate measurable growth.
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

    </section>
  );
};

export default WhyChooseIndustry;