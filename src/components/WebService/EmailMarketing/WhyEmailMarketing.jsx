import "./WhyEmailMarketing.css";
import {
  FaEnvelope,
  FaUsers,
  FaChartLine,
  FaClock,
} from "react-icons/fa";

const WhyEmailMarketing = () => {
  return (
    <section className="why-email">
      <div className="why-email-container">

        <div className="why-email-header">

          <span className="section-tag">
            WHY EMAIL MARKETING
          </span>

          <h2>
            Why Your Business Needs
            <span> Email Marketing</span>
          </h2>

          <p>
            Email marketing is one of the most effective digital marketing
            channels for nurturing leads, increasing customer loyalty, and
            driving sales. With personalized campaigns, you can reach the
            right audience at the right time.
          </p>

        </div>

        <div className="why-email-grid">

          <div className="why-card">
            <div className="why-icon">
              <FaEnvelope />
            </div>

            <h3>Personalized Communication</h3>

            <p>
              Deliver tailored emails that match your audience's interests
              and buying behavior.
            </p>

          </div>

          <div className="why-card">
            <div className="why-icon">
              <FaChartLine />
            </div>

            <h3>Higher ROI</h3>

            <p>
              Email marketing provides one of the highest returns on
              investment compared to other digital marketing channels.
            </p>

          </div>

          <div className="why-card">
            <div className="why-icon">
              <FaUsers />
            </div>

            <h3>Customer Retention</h3>

            <p>
              Keep customers engaged through newsletters, promotions,
              product updates, and exclusive offers.
            </p>

          </div>

          <div className="why-card">
            <div className="why-icon">
              <FaClock />
            </div>

            <h3>Marketing Automation</h3>

            <p>
              Save time with automated email sequences such as welcome,
              follow-up, and promotional campaigns.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyEmailMarketing;