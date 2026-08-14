import "./GoogleAdsServices.css";
import {
  FaSearch,
  FaShoppingCart,
  FaDesktop,
  FaYoutube,
  FaMobileAlt,
  FaChartLine,
} from "react-icons/fa";

const GoogleAdsServices = () => {
  const services = [
    {
      icon: <FaSearch />,
      title: "Search Ads",
      description:
        "Appear at the top of Google search results and connect with customers actively searching for your products or services.",
    },
    {
      icon: <FaShoppingCart />,
      title: "Shopping Ads",
      description:
        "Showcase your products with images, pricing, and details to drive high-intent buyers to your online store.",
    },
    {
      icon: <FaDesktop />,
      title: "Display Ads",
      description:
        "Increase brand awareness with visually engaging banner ads across Google's Display Network.",
    },
    {
      icon: <FaYoutube />,
      title: "YouTube Ads",
      description:
        "Reach your audience through engaging video advertisements on YouTube and partner websites.",
    },
    {
      icon: <FaMobileAlt />,
      title: "App Promotion Ads",
      description:
        "Drive app installs and increase user engagement with targeted app promotion campaigns.",
    },
    {
      icon: <FaChartLine />,
      title: "Campaign Optimization",
      description:
        "Continuously monitor and optimize campaigns to improve conversions while reducing advertising costs.",
    },
  ];

  return (
    <section className="googleads-services">
      <div className="googleads-services-container">

        <div className="googleads-services-header">

          <span className="section-tag">
            OUR SERVICES
          </span>

          <h2>
            Complete <span>Google Ads Solutions</span>
          </h2>

          <p>
            From campaign setup to ongoing optimization, we help businesses
            generate qualified leads and maximize return on investment through
            Google Ads.
          </p>

        </div>

        <div className="googleads-services-grid">

          {services.map((service, index) => (
            <div className="googleads-service-card" key={index}>

              <div className="service-icon">
                {service.icon}
              </div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default GoogleAdsServices;