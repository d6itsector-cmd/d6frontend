import React from "react";
import {
  FaArrowRight,
  FaChartLine,
  FaBullhorn,
  FaLaptopCode,
} from "react-icons/fa";

import { useConsultation } from "../../../context/ConsultationContext";

import "./Hero.css";
import heroImage from "../../../assets/hero-image.png";

const Hero = () => {

  const { openConsultation } = useConsultation();

  return (
    <section className="hero">
      <div className="hero-container">

        {/* Left Content */}

        <div className="hero-content">

          <span className="hero-badge">
            🚀 Your Trusted Digital Growth Partner
          </span>

          <h1>
            Empower Your Business with
            <span> Smart Digital Marketing Solutions</span>
          </h1>

          <p>
            At <strong>D6 Global Media</strong>, we help startups,
            small businesses, and growing brands establish
            a strong online presence. From SEO and Google Ads
            to Social Media Marketing and Website Development,
            we create customized digital strategies that
            increase visibility, generate quality leads,
            and accelerate business growth.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={openConsultation}
            >
              Get Free Consultation
              <FaArrowRight />
            </button>

            <a href="#services" className="secondary-btn">
              Explore Our Services
            </a>

          </div>

          {/* Features */}

          <div className="hero-features">

            <div className="feature">
              <span>✔</span>
              <p>Customized Marketing Strategies</p>
            </div>

            <div className="feature">
              <span>✔</span>
              <p>Transparent Communication</p>
            </div>

            <div className="feature">
              <span>✔</span>
              <p>Affordable Business Solutions</p>
            </div>

          </div>

        </div>

        {/* Right Content */}

        <div className="hero-image">

          <img
            src={heroImage}
            alt="Digital Marketing"
            fetchPriority="high"
          />

          <div className="floating-card card-one">

            <FaChartLine />

            <div>
              <h4>SEO</h4>
              <p>Improve Search Rankings</p>
            </div>

          </div>

          <div className="floating-card card-two">

            <FaBullhorn />

            <div>
              <h4>Google Ads</h4>
              <p>Generate Quality Leads</p>
            </div>

          </div>

          <div className="floating-card card-three">

            <FaLaptopCode />

            <div>
              <h4>Web Development</h4>
              <p>Modern & Responsive Websites</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;