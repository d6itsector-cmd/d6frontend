import React from "react";
import { Link } from "react-router-dom";
import "./AboutSection.css";
import {
  FaBullseye,
  FaLightbulb,
  FaHandshake,
  FaArrowRight,
} from "react-icons/fa";

const About = () => {
  return (
    <section className="about">
      <div className="about-container">

        {/* Left Side */}

        <div className="about-content">

          <span className="section-tag">
            About D6 Global Media
          </span>

          <h2>
            Helping Businesses Build a
            <span> Strong Digital Presence</span>
          </h2>

          <p>
            At <strong>D6 Global Media</strong>, we are passionate about helping
            startups, small businesses, and growing brands establish a strong
            online presence. We combine creativity, technology, and
            data-driven marketing strategies to deliver solutions that increase
            visibility, generate quality leads, and support long-term business
            growth.
          </p>

          <div className="mission-vision">

            <div className="mv-card">
              <FaBullseye className="mv-icon" />

              <div>
                <h4>Our Vision</h4>

                <p>
                  To empower businesses with innovative digital marketing
                  solutions that inspire growth and long-term success.
                </p>
              </div>
            </div>

            <div className="mv-card">
              <FaLightbulb className="mv-icon" />

              <div>
                <h4>Our Mission</h4>

                <p>
                  To provide creative, affordable, and result-oriented digital
                  marketing services tailored to every business.
                </p>
              </div>
            </div>

          </div>

          <Link to="/about" className="about-btn">
            Learn More
            <FaArrowRight />
          </Link>

        </div>

        {/* Right Side */}

        <div className="about-right">

          <div className="feature-card">

            <FaHandshake className="feature-icon" />

            <h3>Client First</h3>

            <p>
              Every strategy we create is focused on your business goals and
              long-term success.
            </p>

          </div>

          <div className="feature-card">

            <FaLightbulb className="feature-icon" />

            <h3>Creative Ideas</h3>

            <p>
              Innovative marketing solutions designed to help your business
              stand out from the competition.
            </p>

          </div>

          <div className="feature-card">

            <FaBullseye className="feature-icon" />

            <h3>Growth Focused</h3>

            <p>
              We build strategies that improve visibility, generate leads,
              and support sustainable business growth.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};

export default About;