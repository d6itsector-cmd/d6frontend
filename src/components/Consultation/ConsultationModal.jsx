import { useState } from "react";
import "./ConsultationModal.css";
import { FaTimes } from "react-icons/fa";

import api from "../../services/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  budget: "",
  message: "",
};

const ConsultationModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [feedback, setFeedback] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setFeedback("");

    try {
      const res = await api.post("/consultation", form);
      setStatus("success");
      setFeedback(res.data?.message || "Thank you. Our team will contact you shortly.");
      setForm(initialForm);
    } catch {
      setStatus("error");
      setFeedback("Something went wrong. Please try again in a moment.");
    }
  };

  return (
    <div className="modal-overlay">

      <div className="consultation-modal">

        <button
          className="close-btn"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <span className="modal-badge">
          FREE CONSULTATION
        </span>

        <h2>Let's Grow Your Business</h2>

        <p>
          Fill out the form below and our experts will contact you
          within 24 hours.
        </p>

        {feedback && (
          <p className={`form-status ${status === "success" ? "success" : "error"}`}>
            {feedback}
          </p>
        )}

        <form className="consultation-form" onSubmit={handleSubmit}>

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

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
          />

          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            required
          >

            <option value="">Select Service</option>

            <option>SEO</option>

            <option>Google Ads</option>

            <option>Social Media Marketing</option>

            <option>Website Development</option>

            <option>Email Marketing</option>

            <option>Branding</option>

            <option>Complete Digital Marketing</option>

          </select>

          <select
            name="budget"
            value={form.budget}
            onChange={handleChange}
          >

            <option value="">Estimated Budget</option>

            <option>Below £1,000</option>

            <option>£1,000 - £5,000</option>

            <option>£5,000 - £10,000</option>

            <option>Above £10,000</option>

          </select>

          <textarea
            rows="5"
            name="message"
            placeholder="Tell us about your project..."
            value={form.message}
            onChange={handleChange}
          ></textarea>

          <button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending..." : "Book Free Consultation"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default ConsultationModal;
