import { useState } from "react";
import "./Newsletter.css";
import { FaPaperPlane } from "react-icons/fa";

import api from "../../services/api";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setFeedback("");

    try {
      // Clicking Subscribe is the user's explicit opt-in action for this form.
      const res = await api.post("/newsletter", { email, consent: true });
      setStatus("success");
      setFeedback(res.data?.message || "You have been subscribed to our newsletter.");
      setEmail("");
    } catch {
      setStatus("error");
      setFeedback("Something went wrong. Please try again in a moment.");
    }
  };

  return (
    <section className="newsletter">

      <div className="newsletter-container">

        <div className="newsletter-content">

          <span>NEWSLETTER</span>

          <h2>
            Stay Updated with
            <br />
            Digital Marketing Trends
          </h2>

          <p>
            Subscribe to receive the latest articles, SEO tips,
            Google Ads strategies, social media insights, and
            exclusive marketing resources directly in your inbox.
          </p>

          {feedback && (
            <p className={`form-status ${status === "success" ? "success" : "error"}`}>
              {feedback}
            </p>
          )}

        </div>

        <form className="newsletter-form" onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={status === "submitting"}>

            <FaPaperPlane />

            {status === "submitting" ? "Subscribing..." : "Subscribe"}

          </button>

        </form>

      </div>

    </section>
  );
};

export default Newsletter;
