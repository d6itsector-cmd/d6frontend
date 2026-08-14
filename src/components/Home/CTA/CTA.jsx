import "./CTA.css";
import { FaArrowRight } from "react-icons/fa";

import { useConsultation } from "../../../context/ConsultationContext";
import { useContact } from "../../../context/ContactContext";

const CTA = ({
  tag = "GET STARTED TODAY",
  title = "Ready to Grow Your Business Online?",
  highlight = "",
  description = "Let's discuss how we can help your business achieve its goals with our digital marketing solutions.",
  primaryBtn = "Get Free Consultation",
  secondaryBtn = "Contact Us",
}) => {

  const { openConsultation } = useConsultation();
  const { openContact } = useContact();

  return (
    <section className="cta">
      <div className="cta-container">

        {/* Tag */}
        <span className="cta-tag">
          {tag}
        </span>

        {/* Heading */}
        <h2>
          {title}
          {highlight && <span> {highlight}</span>}
        </h2>

        {/* Description */}
        <p>
          {description}
        </p>

        {/* Buttons */}
        <div className="cta-buttons">

          <button
            className="primary-btn"
            onClick={openConsultation}
          >
            {primaryBtn}
            <FaArrowRight />
          </button>

          <button
            className="secondary-btn"
            onClick={openContact}
          >
            {secondaryBtn}
          </button>

        </div>

      </div>
    </section>
  );
};

export default CTA;