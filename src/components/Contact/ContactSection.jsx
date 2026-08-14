import { useState } from "react";
import "./ContactSection.css";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPhoneAlt,
} from "react-icons/fa";

import api from "../../services/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const ContactSection = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setFeedback("");

    try {
      const res = await api.post("/contact", form);
      setStatus("success");
      setFeedback(res.data?.message || "Thank you. We have received your message.");
      setForm(initialForm);
    } catch {
      setStatus("error");
      setFeedback("Something went wrong. Please try again in a moment.");
    }
  };

  return (
    <section className="contact-section">

      <div className="contact-container">

        {/* Left Side */}

        <div className="contact-details">

          <span>GET IN TOUCH</span>

          <h2>
            We'd Love to
            <br />
            Hear From You
          </h2>

          <p>
            Whether you have a project idea, need digital marketing
            services, or simply want to learn more about how we can help,
            our team is here to assist you.
          </p>

          <div className="contact-item">
            <FaPhoneAlt />
            <div>
              <h4>Phone</h4>
              <p>
                <a href="tel:+443300888586">+44 330 088 8586</a>
              </p>
            </div>
          </div>

          <div className="contact-item">
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

          <div className="contact-item">
            <FaMapMarkerAlt />
            <div>
              <h4>Office</h4>
              <p>United Kingdom</p>
            </div>
          </div>

          <div className="contact-item">
            <FaClock />
            <div>
              <h4>Working Hours</h4>
              <p>Monday - Saturday | 9:00 AM - 6:00 PM</p>
            </div>
          </div>

        </div>

        {/* Right Side */}

        <div className="contact-form-box">

          <h3>Send Us a Message</h3>

          {feedback && (
            <p className={`form-status ${status === "success" ? "success" : "error"}`}>
              {feedback}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <div className="input-row">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className="input-row">

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
              />

              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
              >

                <option value="">Select Service</option>

                <option>SEO</option>

                <option>Google Ads</option>

                <option>Social Media Marketing</option>

                <option>Website Development</option>

                <option>Email Marketing</option>

              </select>

            </div>

            <textarea
              rows="6"
              name="message"
              placeholder="Tell us about your project..."
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>

          </form>

        </div>

      </div>

    </section>
  );
};

export default ContactSection;
