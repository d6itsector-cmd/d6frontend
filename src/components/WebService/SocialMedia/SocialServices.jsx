import "./SocialServices.css";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaBullhorn,
  FaPenNib,
  FaChartBar,
} from "react-icons/fa";

const SocialServices = () => {
  const services = [
    {
      icon: <FaInstagram />,
      title: "Instagram Marketing",
      description:
        "Grow your brand with engaging posts, reels, stories, and influencer collaborations.",
    },
    {
      icon: <FaFacebookF />,
      title: "Facebook Marketing",
      description:
        "Reach targeted audiences and increase conversions with Facebook campaigns.",
    },
    {
      icon: <FaLinkedinIn />,
      title: "LinkedIn Marketing",
      description:
        "Generate quality B2B leads and build a strong professional presence.",
    },
    {
      icon: <FaBullhorn />,
      title: "Paid Advertising",
      description:
        "Run high-converting social media ad campaigns across multiple platforms.",
    },
    {
      icon: <FaPenNib />,
      title: "Content Creation",
      description:
        "Creative designs, videos, and captions that attract and engage your audience.",
    },
    {
      icon: <FaChartBar />,
      title: "Analytics & Reporting",
      description:
        "Track campaign performance with detailed reports and actionable insights.",
    },
  ];

  return (
    <section className="social-services">
      <div className="social-services-container">

        <div className="social-services-header">
          <span className="section-tag">OUR SERVICES</span>

          <h2>
            Complete <span>Social Media Solutions</span>
          </h2>

          <p>
            From content creation to paid advertising, we provide
            end-to-end social media marketing services that help your
            business grow online.
          </p>
        </div>

        <div className="social-services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-icon">{service.icon}</div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SocialServices;