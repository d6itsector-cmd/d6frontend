import "./GoogleAdsHero.css";
import { Link } from "react-router-dom";
import googleAdsImage from "../../../assets/googleads.jpeg";
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
            Maximize Your Growth with
            <span> Google Ads</span>
          </h1>

          <p>
            Reach customers at the perfect moment with high-performing Google
            Ads campaigns. We create data-driven PPC strategies that increase
            website traffic, generate quality leads, and maximize your return
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
            alt="Google Ads"
          />

        </div>

      </div>
    </section>
  );
};

export default GoogleAdsHero;