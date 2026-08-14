import "./ContactHero.css";
import contactImage from "../../assets/Contact.webp";
import { Link } from "react-router-dom";
import { useConsultation } from "../../context/ConsultationContext";

import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const ContactHero = () => {
  const { openConsultation } = useConsultation();

  return (
    <section className="contact-hero">

      <div className="contact-left">

        <span className="contact-badge">
          CONTACT US
        </span>

        <h1>
          Let's Build
          <span> Something Great</span>
          <br />
          Together
        </h1>

        <p>
          Have a project in mind? Whether you need SEO, Google Ads,
          Website Development, Branding, or a complete Digital
          Marketing strategy, our team is ready to help your
          business grow.
        </p>

        <div className="contact-buttons">

          <button className="primary-btn" onClick={openConsultation}>
            Get Free Consultation
          </button>

          <Link to="/" className="secondary-btn">
            View Services
          </Link>

        </div>

        <div className="contact-info">

          <div className="info-box">
            <FaPhoneAlt />

            <div>
              <h4>Phone</h4>
              <p>
                <a href="tel:+443300888586">+44 330 088 8586</a>
              </p>
            </div>
          </div>

          <div className="info-box">
            <FaEnvelope />

            <div>
              <h4>Email</h4>
              <p>
                <a href="mailto:notifications@d6globalmedia.com">
                  notifications@d6globalmedia.com
                </a>
              </p>
            </div>
          </div>

          <div className="info-box">
            <FaMapMarkerAlt />

            <div>
              <h4>Location</h4>
              <p>United Kingdom</p>
            </div>
          </div>

        </div>

      </div>

      <div className="contact-right">

        <img
          src={contactImage}
          alt="Contact"
        />

      </div>

    </section>
  );
};

export default ContactHero;