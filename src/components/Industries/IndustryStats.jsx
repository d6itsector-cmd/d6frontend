import "./IndustryStats.css";
import {
  FaBriefcase,
  FaSmile,
  FaIndustry,
  FaGlobe,
} from "react-icons/fa";

const stats = [
  {
    icon: <FaBriefcase />,
    number: "250+",
    title: "Projects Delivered",
  },
  {
    icon: <FaSmile />,
    number: "98%",
    title: "Client Satisfaction",
  },
  {
    icon: <FaIndustry />,
    number: "15+",
    title: "Industries Served",
  },
  {
    icon: <FaGlobe />,
    number: "10+",
    title: "Countries Reached",
  },
];

const IndustryStats = () => {
  return (
    <section className="industry-stats">

      <div className="stats-header">

        <span>OUR IMPACT</span>

        <h2>
          Delivering Results That
          <br />
          Drive Business Growth
        </h2>

        <p>
          We measure our success by the success of our clients. Every
          project is focused on delivering measurable business outcomes.
        </p>

      </div>

      <div className="industry-stats-grid">

        {stats.map((item, index) => (
          <div className="industry-stats-card" key={index}>

            <div className="industry-stats-icon">
              {item.icon}
            </div>

            <h3>{item.number}</h3>

            <h4>{item.title}</h4>

          </div>
        ))}

      </div>

    </section>
  );
};

export default IndustryStats;