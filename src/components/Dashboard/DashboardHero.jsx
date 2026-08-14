import "./DashboardHero.css";

import {
  FaArrowRight,
  FaComments,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

const STATUS_LABELS = {
  planning: "Planning",
  active: "In Progress",
  "on-hold": "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "Not set";

// project/status are supplied by Dashboard.jsx from a single GET /api/dashboard
// call, shared with CurrentProject -- avoids duplicate per-card fetches.
const Hero = ({ project, status, setActivePage }) => {
  const { currentUser } = useAuth();

  const progress = project?.progress ?? 0;
  const circleDeg = Math.round((progress / 100) * 360);

  return (
    <section className="dhero">

      {/* Left */}

      <div className="hero-left">

        <span className="hero-badge">
          Dashboard
        </span>

        <h1>
          Welcome Back,
          <span> {currentUser?.displayName || "there"}</span>
        </h1>

        <p>
          {status === "success" && project ? (
            <>
              Your project <strong>{project.name}</strong> is currently{" "}
              <strong>{STATUS_LABELS[project.status] || project.status}</strong>.
            </>
          ) : status === "empty" ? (
            "You don't have any active projects yet."
          ) : (
            "Here's what's happening with your account."
          )}
        </p>

        <div className="hero-buttons">

          <button className="hero-primary" onClick={() => setActivePage("projects")}>
            View Project
            <FaArrowRight />
          </button>

          <button className="hero-secondary" onClick={() => setActivePage("support")}>
            <FaComments />
            Contact Manager
          </button>

        </div>

      </div>

      {/* Right */}

      <div className="hero-right">

        <div
          className="progress-circle"
          style={{
            background: `conic-gradient(#0077CC 0deg, #0077CC ${circleDeg}deg, rgba(255,255,255,.12) ${circleDeg}deg)`,
          }}
        >

          <div className="inner-circle">

            <h2>{progress}%</h2>

            <p>Completed</p>

          </div>

        </div>

        <div className="hero-info">

          <div>

            <FaClock />

            <div>

              <h4>Current Stage</h4>

              <p>{project ? STATUS_LABELS[project.status] || project.status : "No active project"}</p>

            </div>

          </div>

          <div>

            <FaCalendarAlt />

            <div>

              <h4>Delivery Date</h4>

              <p>{project ? formatDate(project.dueDate) : "Not set"}</p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;