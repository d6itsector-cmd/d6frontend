import "./WhyGoogleAds.css";
import {
  FaBullseye,
  FaUsers,
  FaChartLine,
  FaCoins,
} from "react-icons/fa";

const WhyGoogleAds = () => {
  return (
    <section className="why-googleads">
      <div className="why-googleads-container">

        <div className="why-googleads-header">

          <span className="section-tag">
            WHY GOOGLE ADS
          </span>

          <h2>
            Why Your Business Needs
            <span> Google Ads</span>
          </h2>

          <p>
            Google Ads helps your business appear at the top of search
            results, reach customers who are actively searching for your
            products or services, and generate high-quality leads with
            measurable results.
          </p>

        </div>

        <div className="why-googleads-grid">

          <div className="why-card">

            <div className="why-icon">
              <FaBullseye />
            </div>

            <h3>Target the Right Audience</h3>

            <p>
              Reach customers based on keywords, location, demographics,
              interests, and search intent.
            </p>

          </div>

          <div className="why-card">

            <div className="why-icon">
              <FaChartLine />
            </div>

            <h3>Instant Visibility</h3>

            <p>
              Get your business in front of potential customers immediately
              with paid search advertising.
            </p>

          </div>

          <div className="why-card">

            <div className="why-icon">
              <FaUsers />
            </div>

            <h3>Generate Quality Leads</h3>

            <p>
              Attract users who are already looking for your products or
              services, increasing conversion opportunities.
            </p>

          </div>

          <div className="why-card">

            <div className="why-icon">
              <FaCoins />
            </div>

            <h3>Maximize ROI</h3>

            <p>
              Optimize campaigns with data-driven insights to improve
              performance while reducing advertising costs.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyGoogleAds;