import "./OurProcess.css";
import {
  FaSearch,
  FaClipboardList,
  FaPalette,
  FaCode,
  FaRocket,
  FaChartLine,
} from "react-icons/fa";

const process = [
  {
    icon: <FaSearch />,
    title: "Discover",
    desc: "Understand your business, audience, and goals.",
  },
  {
    icon: <FaClipboardList />,
    title: "Plan",
    desc: "Build a strategy tailored to your business needs.",
  },
  {
    icon: <FaPalette />,
    title: "Design",
    desc: "Create attractive and user-friendly experiences.",
  },
  {
    icon: <FaCode />,
    title: "Develop",
    desc: "Build fast, responsive, and scalable solutions.",
  },
  {
    icon: <FaRocket />,
    title: "Launch",
    desc: "Deploy your project with complete testing.",
  },
  {
    icon: <FaChartLine />,
    title: "Grow",
    desc: "Optimize and scale using data-driven insights.",
  },
];

const OurProcess = () => {
  return (
    <section className="ourProcess">

      <div className="process-heading">

        <span>OUR PROCESS</span>

        <h2>
          How We Turn Ideas Into
          <span> Results</span>
        </h2>

        <p>
          Every successful project follows a structured process that ensures
          quality, transparency, and measurable growth.
        </p>

      </div>

      <div className="process-grid">

        {process.map((item, index) => (

          <div className="process-card" key={index}>

            <div className="process-number">
              0{index + 1}
            </div>

            <div className="process-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.desc}</p>

          </div>

        ))}

      </div>

    </section>
  );
};

export default OurProcess;