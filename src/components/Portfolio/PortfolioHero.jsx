import "./PortfolioHero.css";
// Photography: Unsplash (Unsplash Licence), see src/assets/photos/CREDITS.md
import portfolioImg from "../../assets/photos/portfolio-hero.webp";
import { useConsultation } from "../../context/ConsultationContext";

const PortfolioHero = () => {
  const { openConsultation } = useConsultation();

  return (
    <section className="portfolio-hero">

      <div className="portfolio-shape shape1"></div>
      <div className="portfolio-shape shape2"></div>

      <div className="portfolio-container">

        <span className="portfolio-badge">
          OUR PORTFOLIO
        </span>

        <h1 className="portfolio-title">
          Showcasing Our
          <span> Digital Success</span>
          <br />
          Stories
        </h1>

        <p className="portfolio-description">
          Explore how we've helped businesses across different industries
          achieve measurable growth through innovative digital marketing,
          branding, and web development solutions.
        </p>

        <div className="portfolio-buttons">

          <a href="#projects" className="primary-btn">
            View Projects
          </a>

          <button className="secondary-btn" onClick={openConsultation}>
            Get Free Consultation
          </button>

        </div>

        <div className="portfolio-image">
          <img src={portfolioImg} alt="Overhead view of a team working on laptops and devices at a shared project table" width="1080" height="810" loading="lazy" />
        </div>

      </div>

    </section>
  );
};

export default PortfolioHero;