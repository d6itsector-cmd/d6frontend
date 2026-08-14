import React from "react";
import "./Process.css";
import {
  FaComments,
  FaClipboardList,
  FaRocket,
  FaChartLine,
} from "react-icons/fa";

const processData = [
  {
    icon: <FaComments />,
    number: "01",
    title: "Consultation",
    description:
      "We understand your business goals, target audience, and marketing requirements.",
  },
  {
    icon: <FaClipboardList />,
    number: "02",
    title: "Strategy Planning",
    description:
      "Our experts create a customized digital marketing strategy for your business.",
  },
  {
    icon: <FaRocket />,
    number: "03",
    title: "Execution",
    description:
      "We implement campaigns using the latest tools and proven marketing techniques.",
  },
  {
    icon: <FaChartLine />,
    number: "04",
    title: "Growth & Optimization",
    description:
      "We continuously analyze, optimize, and improve campaign performance for better results.",
  },
];

const Process = () => {
  return (
    <section className="process">
      <div className="process-container">

        <div className="section-header">
          <span className="section-tag">Our Process</span>

          <h2>
            How <span>D6 Global Media</span> Works
          </h2>

          <p>
            We follow a simple and effective process to help businesses achieve
            sustainable digital growth.
          </p>
        </div>

        <div className="process-grid">
          {processData.map((item, index) => (
            <div className="process-card" key={index}>

              <div className="process-number">
                {item.number}
              </div>

              <div className="process-icon">
                {item.icon}
              </div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Process;