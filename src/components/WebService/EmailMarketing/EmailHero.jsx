import "./EmailHero.css";
import { Link } from "react-router-dom";
import emailImage from "../../../assets/services/email-marketing.webp";
import { useConsultation } from "../../../context/ConsultationContext";

const EmailHero = () => {

  const { openConsultation } = useConsultation();

  return (
    <section className="email-hero">
      <div className="email-hero-container">

        <div className="email-hero-content">

          <span className="hero-badge">
            EMAIL MARKETING
          </span>

          <h1>
            Grow Your Business with
            <span> Email Marketing</span>
          </h1>

          <p>
            Build meaningful customer relationships with personalised email
            campaigns. Increase engagement, generate quality leads, and drive
            more sales through data-driven email marketing strategies.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={openConsultation}
            >
              Get Free Consultation
            </button>

            <Link to="/portfolio" className="secondary-btn">
              Our Work
            </Link>

          </div>

        </div>

        <div className="email-hero-image">

          <img
            src={emailImage}
            alt="Marketer planning an automated email campaign workflow on a whiteboard"
            width="1200"
            height="900"
          />

        </div>

      </div>
    </section>
  );
};

export default EmailHero;