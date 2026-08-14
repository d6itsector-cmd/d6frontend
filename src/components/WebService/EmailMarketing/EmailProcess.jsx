import "./EmailProcess.css";
import {
  FaSearch,
  FaPenNib,
  FaPaperPlane,
  FaChartLine,
} from "react-icons/fa";

const EmailProcess = () => {
  const process = [
    {
      number: "01",
      icon: <FaSearch />,
      title: "Audience Research",
      description:
        "We analyze your audience, segment subscribers, and define campaign goals to maximize engagement.",
    },
    {
      number: "02",
      icon: <FaPenNib />,
      title: "Email Design & Content",
      description:
        "Our team creates visually appealing email templates with compelling copy that encourages action.",
    },
    {
      number: "03",
      icon: <FaPaperPlane />,
      title: "Campaign Launch",
      description:
        "We schedule, automate, and launch email campaigns at the right time for maximum impact.",
    },
    {
      number: "04",
      icon: <FaChartLine />,
      title: "Performance Analysis",
      description:
        "We monitor open rates, click-through rates, conversions, and optimize campaigns for better results.",
    },
  ];

  return (
    <section className="email-process">
      <div className="email-process-container">

        <div className="process-header">

          <span className="section-tag">
            OUR PROCESS
          </span>

          <h2>
            Our Email Marketing <span>Process</span>
          </h2>

          <p>
            We follow a proven process to create effective email campaigns
            that engage your audience and deliver measurable business growth.
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

export default EmailProcess;