import "./SeoHero.css";
import { Link } from "react-router-dom";
import heroImage from "../../../assets/hero-image.png";

import {
  FaArrowRight,
  FaCheckCircle,
  FaSearch,
} from "react-icons/fa";

import { useConsultation } from "../../../context/ConsultationContext";

const Hero = () => {

  const { openConsultation } = useConsultation();

  return (
    <section className="seo-hero">
      <div className="seo-container">

        {/* Left Content */}
        <div className="seo-left">

          <span className="seo-badge">
            🚀 SEO Solutions for Growing Businesses
          </span>

          <h1>
            Grow Your Business with
            <span> Smart SEO </span>
            Strategies
          </h1>

          <p>
            Improve your search rankings, attract high-quality traffic, and
            generate more qualified leads with our result-driven SEO services.
            We help startups and growing businesses build a strong online
            presence through ethical, data-driven optimization strategies that
            deliver measurable results.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={openConsultation}
            >
              Get Free SEO Consultation
              <FaArrowRight />
            </button>

            <Link to="/portfolio" className="secondary-btn">
              View Our Work
            </Link>

          </div>

          <div className="hero-features">

            <div>
              <FaCheckCircle />
              Customized SEO Strategy
            </div>

            <div>
              <FaCheckCircle />
              Technical SEO Optimization
            </div>

            <div>
              <FaCheckCircle />
              Monthly Performance Reports
            </div>

            <div>
              <FaCheckCircle />
              Dedicated SEO Experts
            </div>

          </div>

        </div>

        {/* Right Content */}

        <div className="seo-right">

          <img src={heroImage} alt="SEO Services" />

          <div className="floating-card">

            <FaSearch className="icon" />

            <div>

              <h3>+185% Organic Traffic</h3>

              <p>Average Growth for Our Clients</p>

            </div>

          </div>

        </div>

      </div>

      {/* Statistics */}

      <div className="stats-container">

        <div className="stat-card">
          <h2>150+</h2>
          <p>Successful Projects</p>
        </div>

        <div className="stat-card">
          <h2>98%</h2>
          <p>Client Satisfaction</p>
        </div>

        <div className="stat-card">
          <h2>300%</h2>
          <p>Average Organic Growth</p>
        </div>

        <div className="stat-card">
          <h2>24/7</h2>
          <p>Expert Support</p>
        </div>

      </div>

    </section>
  );
};

export default Hero;