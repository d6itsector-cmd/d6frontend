import "./SEOProcess.css";
import {
  FaSearch,
  FaLightbulb,
  FaTools,
  FaChartLine,
} from "react-icons/fa";

const process = [
  {
    icon: <FaSearch />,
    number: "01",
    title: "Website Audit",
    description:
      "We analyze your website to identify SEO issues, opportunities, and areas for improvement.",
  },
  {
    icon: <FaLightbulb />,
    number: "02",
    title: "SEO Strategy",
    description:
      "We create a customized SEO plan based on your business goals, audience, and competitors.",
  },
  {
    icon: <FaTools />,
    number: "03",
    title: "Optimization",
    description:
      "Our team implements on-page, technical, and content optimizations to improve rankings.",
  },
  {
    icon: <FaChartLine />,
    number: "04",
    title: "Growth & Reporting",
    description:
      "We continuously monitor performance, provide monthly reports, and improve results.",
  },
];

const SEOProcess = () => {
  return (
    <section className="seo-process">
      <div className="seo-process-container">

        <span className="section-tag">
          OUR PROCESS
        </span>

        <h2>
          How We Help Your Business
          <span> Grow</span>
        </h2>

        <p className="section-description">
          Our simple and proven SEO process is designed to improve your search
          rankings, increase organic traffic, and deliver long-term business
          growth.
        </p>

        <div className="process-grid">
          {process.map((item, index) => (
            <div className="process-card" key={index}>

              <div className="process-number">
                {item.number}
              </div>

              <div className="process-icon">
                {item.icon}
              </div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SEOProcess;