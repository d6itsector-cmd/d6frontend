import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Auth.css";
import { useAuth } from "../../context/AuthContext";

const RESEND_COOLDOWN = 30;

const VerifyEmail = () => {
  const { currentUser, emailVerified, authLoading, resendVerification, reloadUser, logout } =
    useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/", { state: { openLogin: true } });
    }
  }, [authLoading, currentUser, navigate]);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    setError("");
    setMessage("");

    try {
      await resendVerification();
      setMessage("Verification email sent. Please check your inbox.");
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRefresh = async () => {
    setError("");
    setChecking(true);

    try {
      await reloadUser();
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <span className="auth-badge">ONE MORE STEP</span>

        <h2>Verify Your Email</h2>

        <p className="auth-subtitle">
          We sent a verification link to <strong>{currentUser?.email}</strong>.
          Please verify your email to continue.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        {emailVerified ? (
          <div className="auth-actions">
            <div className="auth-success">Your email is verified.</div>
            <button className="auth-submit-btn" onClick={() => navigate("/dashboard")}>
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <div className="auth-actions">

            <button className="auth-submit-btn" onClick={handleRefresh} disabled={checking}>
              {checking ? "Checking..." : "I've Verified — Refresh Status"}
            </button>

            <button
              className="google-btn"
              onClick={handleResend}
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? `Resend Email (${cooldown}s)` : "Resend Verification Email"}
            </button>

          </div>
        )}

        <p className="auth-footer">
          Wrong account?{" "}
          <button type="button" className="link-btn" onClick={handleLogout}>
            Logout
          </button>
        </p>

      </div>

    </div>
  );
};

export default VerifyEmail;
