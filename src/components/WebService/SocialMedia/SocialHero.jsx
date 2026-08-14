import "./SocialHero.css";
import { Link } from "react-router-dom";
import socialImage from "../../../assets/socialmedia.jpg";

import { useConsultation } from "../../../context/ConsultationContext";

const SocialHero = () => {

  const { openConsultation } = useConsultation();

  return (
    <section className="social-hero">
      <div className="social-hero-container">

        <div className="social-hero-content">

          <span className="hero-badge">
            SOCIAL MEDIA MARKETING
          </span>

          <h1>
            Build Your Brand With
            <span> Social Media</span>
          </h1>

          <p>
            Connect with your audience, increase brand awareness,
            and drive meaningful business growth through strategic
            social media marketing.
          </p>

          <div className="hero-btns">

            <button
              className="btn-primary"
              onClick={openConsultation}
            >
              Get Free Consultation
            </button>

            <Link to="/portfolio" className="btn-secondary">
              View Our Work
            </Link>

          </div>

        </div>

        <div className="social-hero-image">
          <img
            src={socialImage}
            alt="Social Media Marketing"
          />
        </div>

      </div>
    </section>
  );
};

export default SocialHero;