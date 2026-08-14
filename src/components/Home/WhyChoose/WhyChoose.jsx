import React from "react";
import "./WhyChoose.css";

import {
  FaCheckCircle,
  FaChartLine,
  FaUsers,
  FaHeadset,
  FaRocket,
  FaLightbulb,
} from "react-icons/fa";

import { useConsultation } from "../../../context/ConsultationContext";

const features = [
  {
    icon: <FaRocket />,
    title: "Result-Driven Strategy",
    desc: "We create customized digital marketing strategies focused on achieving measurable business growth.",
  },
  {
    icon: <FaChartLine />,
    title: "Data-Based Decisions",
    desc: "Every campaign is optimized using analytics to maximize performance and ROI.",
  },
  {
    icon: <FaUsers />,
    title: "Experienced Team",
    desc: "Our skilled professionals bring creativity, technology, and marketing expertise together.",
  },
  {
    icon: <FaHeadset />,
    title: "Dedicated Support",
    desc: "We're always available to answer questions and support your business at every stage.",
  },
  {
    icon: <FaLightbulb />,
    title: "Creative Solutions",
    desc: "Innovative ideas and modern marketing techniques that help your business stand out.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Affordable Pricing",
    desc: "Professional digital marketing services designed to fit businesses of every size.",
  },
];

const WhyChoose = ({
  tag = "Why Choose Us",
  title = "Why Businesses Choose",
  highlight = "D6 Global Media",
  description = "We combine creativity, technology, and marketing expertise to help businesses build a strong online presence, generate quality leads, and achieve long-term growth.",
  buttonText = "Get Free Consultation",
}) => {

  const { openConsultation } = useConsultation();

  return (
    <section className="whychoose">
      <div className="whychoose-container">

        {/* Left Content */}

        <div className="why-left">

          <span className="section-tag">
            {tag}
          </span>

          <h2>
            {title}
            <span> {highlight}</span>
          </h2>

          <p>{description}</p>

          <button
            className="choose-btn"
            onClick={openConsultation}
          >
            {buttonText}
          </button>

        </div>

        {/* Right Content */}

        <div className="why-right">

          {features.map((item, index) => (

            <div
              className="choose-card"
              key={index}
            >

              <div className="choose-icon">
                {item.icon}
              </div>

              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
};

export default WhyChoose;