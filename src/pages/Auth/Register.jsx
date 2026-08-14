import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

import "./Auth.css";
import { useAuth } from "../../context/AuthContext";
import { resolvePostLoginDestination } from "../../utils/postLoginRoute";

const Register = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await register(email, password, fullName);
      navigate("/verify-email");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setSubmitting(true);

    try {
      await loginWithGoogle();
      navigate(await resolvePostLoginDestination());
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <span className="auth-badge">GET STARTED</span>

        <h2>Create Your Account</h2>

        <p className="auth-subtitle">
          Register to track projects and connect with our team.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            required
          />

          <div className="auth-actions">

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Creating account..." : "Register"}
            </button>

            <div className="auth-divider">OR</div>

            <button
              type="button"
              className="google-btn"
              onClick={handleGoogle}
              disabled={submitting}
            >
              <FaGoogle />
              Continue with Google
            </button>

          </div>

        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/" state={{ openLogin: true }}>Login</Link>
        </p>

      </div>

    </div>
  );
};

export default Register;
