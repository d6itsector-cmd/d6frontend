import { Link } from "react-router-dom";

import "./Auth/Auth.css";
import "./NotFound.css";
import { useAuth } from "../context/AuthContext";
import { useUserRole } from "../hooks/useUserRole";

const NotFound = () => {
  const { currentUser } = useAuth();
  const { role } = useUserRole();

  const authedDestination = role === "admin" ? "/admin" : "/dashboard";
  const authedLabel = role === "admin" ? "Go to Admin Panel" : "Go to Dashboard";

  return (
    <div className="auth-page not-found-page">

      <div className="auth-card not-found-card">

        <span className="auth-badge">404</span>

        <h2>Page Not Found</h2>

        <p className="auth-subtitle">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="auth-actions">

          <Link to="/" className="auth-submit-btn not-found-link">
            Go to Home
          </Link>

          {currentUser && (
            <Link to={authedDestination} className="google-btn not-found-link">
              {authedLabel}
            </Link>
          )}

        </div>

      </div>

    </div>
  );
};

export default NotFound;
