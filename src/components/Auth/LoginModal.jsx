import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaTimes } from "react-icons/fa";

import "../../pages/Auth/Auth.css";
import "./LoginModal.css";
import { useAuth } from "../../context/AuthContext";
import { resolvePostLoginDestination } from "../../utils/postLoginRoute";
import logo from "../../assets/d6.png";

const LoginModal = ({ isOpen, onClose }) => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const finishLogin = async () => {
    const destination = await resolvePostLoginDestination();
    resetForm();
    onClose();
    navigate(destination);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      await finishLogin();
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
      await finishLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-modal-overlay" onClick={handleClose}>

      <div className="login-modal auth-card" onClick={(e) => e.stopPropagation()}>

        <button className="close-modal" onClick={handleClose} aria-label="Close">
          <FaTimes />
        </button>

        <img src={logo} alt="D6 Global Media" className="login-modal-logo" />

        <span className="auth-badge">WELCOME BACK</span>

        <h2>Login to Your Account</h2>

        <p className="auth-subtitle">
          Access your dashboard and manage your projects.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>

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
            required
          />

          <Link to="/forgot-password" className="auth-forgot-link" onClick={handleClose}>
            Forgot password?
          </Link>

          <div className="auth-actions">

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
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
          Don't have an account? <Link to="/register" onClick={handleClose}>Register</Link>
        </p>

      </div>

    </div>
  );
};

export default LoginModal;
