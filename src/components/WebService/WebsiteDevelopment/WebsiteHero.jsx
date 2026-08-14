import "./WebsiteHero.css";
import { Link } from "react-router-dom";
import websiteImage from "../../../assets/websitedev.png";
import { useConsultation } from "../../../context/ConsultationContext";

const WebsiteHero = () => {

  const { openConsultation } = useConsultation();

  return (
    <section className="website-hero">
      <div className="website-hero-container">

        <div className="website-hero-content">

          <span className="hero-badge">
            WEBSITE DEVELOPMENT
          </span>

          <h1>
            Build Modern &
            <span> High-Performance Websites</span>
          </h1>

          <p>
            We create responsive, fast, secure, and SEO-friendly websites that
            help your business establish a strong online presence, attract more
            customers, and drive long-term growth.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={openConsultation}
            >
              Get Free Consultation
            </button>

            <Link to="/portfolio" className="secondary-btn">
              View Portfolio
            </Link>

          </div>

        </div>

        <div className="website-hero-image">

          <img
            src={websiteImage}
            alt="Website Development"
          />

        </div>

      </div>
    </section>
  );
};

export default WebsiteHero;