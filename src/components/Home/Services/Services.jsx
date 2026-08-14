import React from "react";
import { Link } from "react-router-dom";

import {
  FaSearch,
  FaBullhorn,
  FaShareAlt,
  FaLaptopCode,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";

import "./Services.css";

const services = [
  {
    title: "SEO",
    description:
      "Improve your website's visibility and attract organic traffic through effective Search Engine Optimization.",
    icon: <FaSearch />,
    path: "/services/seo",
  },

  {
    title: "Google Ads",
    description:
      "Reach the right audience with targeted advertising campaigns that generate quality leads.",
    icon: <FaBullhorn />,
    path: "/services/google-ads",
  },

  {
    title: "Social Media Marketing",
    description:
      "Build your brand presence and engage your audience across leading social platforms.",
    icon: <FaShareAlt />,
    path: "/services/social-media",
  },

  {
    title: "Website Development",
    description:
      "Create fast, responsive, and modern websites that deliver an excellent user experience.",
    icon: <FaLaptopCode />,
    path: "/services/web-development",
  },

  {
    title: "Email Marketing",
    description:
      "Reach your customers with targeted email campaigns that build relationships and drive conversions.",
    icon: <FaEnvelope />,
    path: "/services/email-marketing",
  },
];

const Services = () => {
  return (
    <section id="services" className="services">

      <div className="services-container">

        {/* Heading */}

        <div className="services-heading">
          <span>OUR SERVICES</span>

          <h2>
            Digital Marketing
            <br />
            Solutions That Grow
          </h2>

          <p>
            We provide result-driven digital marketing services
            designed to increase your visibility, generate leads,
            and grow your business.
          </p>
        </div>


        {/* Services Grid */}

        <div className="services-grid">

          {services.map((service) => (

            <div
              className="service-card"
              key={service.title}
            >

              {/* Icon */}

              <div className="service-icon">
                {service.icon}
              </div>


              {/* Title */}

              <h3>
                {service.title}
              </h3>


              {/* Description */}

              <p>
                {service.description}
              </p>


              {/* Learn More */}

              <Link
                to={service.path}
                className="learn-more"
              >
                <span>Learn More</span>

                <FaArrowRight />
              </Link>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default Services;