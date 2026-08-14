import "./GoogleAdsProcess.css";
import {
  FaCrosshairs,
  FaCogs,
  FaBullhorn,
  FaChartPie,
} from "react-icons/fa";

const GoogleAdsProcess = () => {
  const process = [
    {
      number: "01",
      icon: <FaCrosshairs />,
      title: "Keyword Research",
      description:
        "We identify high-performing keywords and analyze competitors to target the right audience.",
    },
    {
      number: "02",
      icon: <FaCogs />,
      title: "Campaign Setup",
      description:
        "Our team creates well-structured campaigns with optimized ad groups, bidding strategies, and compelling ad copy.",
    },
    {
      number: "03",
      icon: <FaBullhorn />,
      title: "Launch & Management",
      description:
        "We launch your campaigns, monitor daily performance, adjust bids, and improve ad quality for better results.",
    },
    {
      number: "04",
      icon: <FaChartPie />,
      title: "Optimization & Reporting",
      description:
        "Detailed reports and continuous optimization help maximize conversions while reducing advertising costs.",
    },
  ];

  return (
    <section className="googleads-process">
      <div className="googleads-process-container">

        <div className="process-header">

          <span className="section-tag">
            OUR PROCESS
          </span>

          <h2>
            Our Google Ads <span>Process</span>
          </h2>

          <p>
            We follow a proven PPC strategy to create, manage, and optimize
            campaigns that deliver measurable business growth and maximize
            your return on investment.
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

export default GoogleAdsProcess;