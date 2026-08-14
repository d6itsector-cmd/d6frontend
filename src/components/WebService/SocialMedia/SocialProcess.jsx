import "./SocialProcess.css";
import {
  FaSearch,
  FaPenNib,
  FaBullhorn,
  FaChartLine,
} from "react-icons/fa";

const SocialProcess = () => {
  const process = [
    {
      icon: <FaSearch />,
      number: "01",
      title: "Research & Strategy",
      description:
        "We analyze your business, competitors, audience, and goals to create a customized social media strategy.",
    },
    {
      icon: <FaPenNib />,
      number: "02",
      title: "Content Creation",
      description:
        "Our creative team designs engaging posts, reels, stories, and captions tailored to your brand.",
    },
    {
      icon: <FaBullhorn />,
      number: "03",
      title: "Campaign Management",
      description:
        "We publish content, manage paid advertising campaigns, and actively engage with your audience.",
    },
    {
      icon: <FaChartLine />,
      number: "04",
      title: "Performance Analysis",
      description:
        "Track campaign success through analytics, reports, and continuous optimization for better ROI.",
    },
  ];

  return (
    <section className="social-process">
      <div className="social-process-container">

        <div className="process-header">
          <span className="section-tag">OUR PROCESS</span>

          <h2>
            How We <span>Work</span>
          </h2>

          <p>
            We follow a proven process to help your business achieve consistent
            growth through effective social media marketing.
          </p>
        </div>

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

export default SocialProcess;