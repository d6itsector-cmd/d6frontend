import "./IndustryHero.css";
import startupImg from "../../assets/industry.jpg";
import { useConsultation } from "../../context/ConsultationContext";

const StartupHero = () => {

  const { openConsultation } = useConsultation();

  return (
    <section className="startup-hero">

      {/* Background Shapes */}
      <div className="shape shape1"></div>
      <div className="shape shape2"></div>
      <div className="shape shape3"></div>

      <div className="startup-container">

        {/* Badge */}
        <div className="hero-badge">
          🚀 INDUSTRIES
        </div>

        {/* Heading */}
        <h1 className="hero-title">
          Helping <span>Startups</span> Build,
          <br />
          Launch & Scale Digitally
        </h1>

        {/* Description */}
        <p className="hero-description">
          We help innovative startups grow with SEO, Google Ads,
          Social Media Marketing, Branding, and Website Development
          that delivers measurable business results.
        </p>

        {/* Buttons */}
        <div className="hero-buttons">

          <button
            className="primary-btn"
            onClick={openConsultation}
          >
            Get Free Consultation
          </button>

          <a href="/#services" className="secondary-btn">
            Explore Services
          </a>

        </div>

        {/* Illustration */}
        <div className="hero-image">

          <div className="floating-card idea">
            💡
            <span>Creative Ideas</span>
          </div>

          <div className="floating-card growth">
            📈
            <span>Business Growth</span>
          </div>

          <img
            src={startupImg}
            alt="Startup Marketing"
            loading="lazy"
          />

          <div className="floating-card leads">
            🎯
            <span>Quality Leads</span>
          </div>

          <div className="floating-card branding">
            ⭐
            <span>Brand Identity</span>
          </div>

        </div>

      </div>

    </section>
  );
};

export default StartupHero;