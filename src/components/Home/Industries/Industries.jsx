import React from "react";
import "./Industries.css";
import {
  FaLaptopCode,
  FaHeartbeat,
  FaShoppingCart,
  FaHome,
  FaGraduationCap,
  FaUtensils,
  FaBriefcase,
  FaPlaneDeparture,
} from "react-icons/fa";

const industries = [
  {
    icon: <FaLaptopCode />,
    title: "IT & Software",
    desc: "Helping tech companies build a strong digital presence.",
  },
  {
    icon: <FaHeartbeat />,
    title: "Healthcare",
    desc: "Marketing solutions for clinics, hospitals, and healthcare providers.",
  },
  {
    icon: <FaShoppingCart />,
    title: "E-Commerce",
    desc: "Drive more sales and improve your online store's visibility.",
  },
  {
    icon: <FaHome />,
    title: "Real Estate",
    desc: "Generate quality leads for real estate businesses and agencies.",
  },
  {
    icon: <FaGraduationCap />,
    title: "Education",
    desc: "Promote educational institutions and online learning platforms.",
  },
  {
    icon: <FaUtensils />,
    title: "Restaurants",
    desc: "Grow your restaurant brand with digital marketing strategies.",
  },
  {
    icon: <FaBriefcase />,
    title: "Corporate",
    desc: "Professional marketing solutions for corporate businesses.",
  },
  {
    icon: <FaPlaneDeparture />,
    title: "Travel & Tourism",
    desc: "Increase bookings and reach more travelers online.",
  },
];

const Industries = () => {
  return (
    <section className="industries">
      <div className="industries-container">

        <div className="section-header">
          <span className="section-tag">Industries We Serve</span>

          <h2>
            Helping Businesses Across
            <span> Multiple Industries</span>
          </h2>

          <p>
            We deliver customized digital marketing solutions tailored to the
            unique goals and challenges of every industry.
          </p>
        </div>

        <div className="industries-grid">
          {industries.map((industry, index) => (
            <div className="industry-card" key={index}>

              <div className="industry-icon">
                {industry.icon}
              </div>

              <h3>{industry.title}</h3>

              <p>{industry.desc}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Industries;