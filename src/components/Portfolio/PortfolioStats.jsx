import "./PortfolioStats.css";
import {
  FaBriefcase,
  FaUsers,
  FaChartLine,
  FaAward,
} from "react-icons/fa";

const stats = [
  {
    icon: <FaBriefcase />,
    number: "250+",
    title: "Projects Completed",
    description: "Successfully delivered across multiple industries."
  },
  {
    icon: <FaUsers />,
    number: "150+",
    title: "Happy Clients",
    description: "Helping businesses achieve sustainable growth."
  },
  {
    icon: <FaChartLine />,
    number: "98%",
    title: "Client Satisfaction",
    description: "Focused on measurable results and long-term success."
  },
  {
    icon: <FaAward />,
    number: "5+",
    title: "Years Experience",
    description: "Delivering innovative digital marketing solutions."
  },
];

const PortfolioStats = () => {
  return (
    <section className="portfolio-stats">

      <div className="stats-heading">

        <span>OUR IMPACT</span>

        <h2>
          Numbers That Reflect
          <br />
          Our Success
        </h2>

        <p>
          We are committed to delivering measurable results that help
          businesses grow, improve visibility, and achieve long-term success.
        </p>

      </div>

      <div className="stats-grid">

        {stats.map((item, index) => (

          <div className="stats-card" key={index}>

            <div className="stats-icon">
              {item.icon}
            </div>

            <h3>{item.number}</h3>

            <h4>{item.title}</h4>

            <p>{item.description}</p>

          </div>

        ))}

      </div>

    </section>
  );
};

export default PortfolioStats;