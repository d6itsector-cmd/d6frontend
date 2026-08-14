import "./WhySocialMedia.css";
import {
  FaBullhorn,
  FaUsers,
  FaChartLine,
  FaHeart,
} from "react-icons/fa";

const WhySocialMedia = () => {
  return (
    <section className="why-social">
      <div className="why-social-container">

        <div className="why-header">

          <span className="section-tag">
            WHY SOCIAL MEDIA
          </span>

          <h2>
            Why Your Business Needs
            <span> Social Media Marketing</span>
          </h2>

          <p>
            Social media is one of the most effective ways to build your
            brand, connect with customers, and grow your business. Our
            strategies help you create meaningful engagement and drive
            measurable business results.
          </p>

        </div>

        <div className="why-grid">

          <div className="why-card">
            <div className="icon">
              <FaBullhorn />
            </div>

            <h3>Increase Brand Awareness</h3>

            <p>
              Reach more people and make your brand visible across multiple
              social media platforms.
            </p>
          </div>

          <div className="why-card">
            <div className="icon">
              <FaUsers />
            </div>

            <h3>Engage Your Audience</h3>

            <p>
              Build strong relationships with customers through consistent
              interaction and valuable content.
            </p>
          </div>

          <div className="why-card">
            <div className="icon">
              <FaChartLine />
            </div>

            <h3>Generate More Leads</h3>

            <p>
              Turn followers into customers using targeted campaigns and
              strategic social media marketing.
            </p>
          </div>

          <div className="why-card">
            <div className="icon">
              <FaHeart />
            </div>

            <h3>Build Customer Loyalty</h3>

            <p>
              Keep your audience engaged and encourage repeat business by
              creating valuable and engaging content.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhySocialMedia;