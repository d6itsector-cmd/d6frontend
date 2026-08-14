import "./IndustryProcess.css";
import {
  FaSearch,
  FaLightbulb,
  FaBullhorn,
  FaChartLine,
  FaRocket,
} from "react-icons/fa";

const process = [
  {
    icon: <FaSearch />,
    title: "Discover",
    desc: "We understand your business, audience, goals, and industry challenges.",
  },
  {
    icon: <FaLightbulb />,
    title: "Strategy",
    desc: "We create a customized marketing strategy tailored to your business.",
  },
  {
    icon: <FaBullhorn />,
    title: "Execute",
    desc: "Our experts launch campaigns across SEO, social media, and paid ads.",
  },
  {
    icon: <FaChartLine />,
    title: "Optimize",
    desc: "We continuously monitor and improve campaign performance.",
  },
  {
    icon: <FaRocket />,
    title: "Grow",
    desc: "Scale your business with measurable growth and long-term success.",
  },
];

const IndustryProcess = () => {
  return (
    <section className="industry-process">

      <div className="process-header">

        <span>OUR PROCESS</span>

        <h2>
          How We Help Businesses
          <br />
          Achieve Digital Success
        </h2>

        <p>
          Our proven digital marketing process ensures every campaign
          is strategically planned, expertly executed, and continuously
          optimized for measurable growth.
        </p>

      </div>

      <div className="process-timeline">

        {process.map((step, index) => (
          <div className="process-step" key={index}>

            <div className="process-icon">
              {step.icon}
            </div>

            <h3>{step.title}</h3>

            <p>{step.desc}</p>

            {index !== process.length - 1 && (
              <div className="process-line"></div>
            )}

          </div>
        ))}

      </div>

    </section>
  );
};

export default IndustryProcess;