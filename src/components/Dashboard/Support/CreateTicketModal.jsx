import { useState } from "react";
import { FaTimes } from "react-icons/fa";

import "./TicketModals.css";
import api from "../../../services/api";

const initialForm = { subject: "", description: "", category: "general" };

const CreateTicketModal = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setError("");

    try {
      const res = await api.post("/support", form);
      setForm(initialForm);
      onCreated(res.data.data);
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
      return;
    }
    setStatus("idle");
  };

  return (
    <div className="ticket-modal-overlay" onClick={onClose}>

      <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>

        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <h2>Create Support Ticket</h2>

        {error && <p className="ticket-modal-error">{error}</p>}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
          />

          <select name="category" value={form.category} onChange={handleChange}>
            <option value="general">General</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="project">Project</option>
          </select>

          <textarea
            rows="5"
            name="description"
            placeholder="Describe your issue..."
            value={form.description}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Creating..." : "Create Ticket"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default CreateTicketModal;
