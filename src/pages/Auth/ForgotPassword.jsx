import { useState } from "react";
import { Link } from "react-router-dom";

import "./Auth.css";
import { useAuth } from "../../context/AuthContext";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <span className="auth-badge">RESET PASSWORD</span>

        <h2>Forgot Your Password?</h2>

        <p className="auth-subtitle">
          Enter your email and we'll send you a reset link.
        </p>

        {error && <div className="auth-error">{error}</div>}

        {submitted ? (
          <div className="auth-success">
            If an account exists for {email}, a password reset link has been sent.
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>

          </form>
        )}

        <p className="auth-footer">
          Remembered your password?{" "}
          <Link to="/" state={{ openLogin: true }}>Login</Link>
        </p>

      </div>

    </div>
  );
};

export default ForgotPassword;
