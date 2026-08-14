import "./ContactModal.css";

import { Link } from "react-router-dom";
import {
  FaTimes,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="contact-overlay" onClick={onClose}>

      <div
        className="contact-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="close-modal"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <span className="contact-badge">
          CONTACT US
        </span>

        <h2>Let's Connect</h2>

        <p>
          Choose your preferred way to reach our team.
          We're happy to help you grow your business.
        </p>

        <div className="contact-options">

          {/* Email */}

          <a
            href="mailto:notifications@d6globalmedia.com"
            className="contact-card"
          >
            <div className="contact-icon email">
              <FaEnvelope />
            </div>

            <div className="contact-info">
              <h4>Email Us</h4>
              <span>notifications@d6globalmedia.com</span>
            </div>

          </a>

          {/* Contact form */}

          <Link
            to="/contact"
            className="contact-card"
            onClick={onClose}
          >
            <div className="contact-icon">
              <FaPaperPlane />
            </div>

            <div className="contact-info">
              <h4>Send a Message</h4>
              <span>Fill out our contact form</span>
            </div>

          </Link>

        </div>

      </div>

    </div>
  );
};

export default ContactModal;