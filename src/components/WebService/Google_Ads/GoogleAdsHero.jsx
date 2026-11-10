import "./GoogleAdsHero.css";
import { Link } from "react-router-dom";
import googleAdsImage from "../../../assets/services/google-ads.webp";
import { useConsultation } from "../../../context/ConsultationContext";

const GoogleAdsHero = () => {

  const { openConsultation } = useConsultation();

  return (
    <section className="googleads-hero">
      <div className="googleads-hero-container">

        <div className="googleads-hero-content">

          <span className="hero-badge">
            GOOGLE ADS (PPC)
          </span>

          <h1>
            Maximise Your Growth with
            <span> Google Ads</span>
          </h1>

          <p>
            Reach customers at the perfect moment with high-performing Google
            Ads campaigns. We create data-driven PPC strategies that increase
            website traffic, generate quality leads, and maximise your return
            on investment.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={openConsultation}
            >
              Get Free Consultation
            </button>

            <Link to="/portfolio" className="secondary-btn">
              View Our Work
            </Link>

          </div>

        </div>

        <div className="googleads-hero-image">

          <img
            src={googleAdsImage}
            alt="Laptop showing pay-per-click advertising performance charts and conversion metrics"
            width="1200"
            height="900"
          />

        </div>

      </div>
    </section>
  );
};

export default GoogleAdsHero;