import "./CurrentProject.css";

import {
  FaClock,
  FaCalendarAlt,
  FaFlag,
} from "react-icons/fa";

const STATUS_LABELS = {
  planning: "Planning",
  active: "In Progress",
  "on-hold": "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not set";

// project/status are supplied by Dashboard.jsx from a single GET /api/dashboard
// call, shared with DashboardHero -- avoids duplicate per-card fetches.
const CurrentProject = ({ project, status }) => {
  if (status === "loading") {
    return null;
  }

  if (status === "error") {
    return (
      <section className="current-project">
        <p>We couldn't load your project right now. Please try again shortly.</p>
      </section>
    );
  }

  if (status === "empty") {
    return (
      <section className="current-project">
        <p>You don't have any projects yet. Your assigned projects will appear here.</p>
      </section>
    );
  }

  return (
    <section className="current-project">

      <div className="project-header">

        <div>

          <span className="project-tag">
            Current Project
          </span>

          <h2>{project.name}</h2>

          <p>
            {project.description || "No description has been added for this project yet."}
          </p>

        </div>

        <div className="project-status">
          {STATUS_LABELS[project.status] || project.status}
        </div>

      </div>

      <div className="progress-wrapper">

        <div className="progress-title">

          <span>Overall Progress</span>

          <strong>{project.progress ?? 0}%</strong>

        </div>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{ width: `${project.progress ?? 0}%` }}
          ></div>

        </div>

      </div>

      <div className="project-details">

        <div className="detail-card">

          <FaClock />

          <div>

            <h4>Service</h4>

            <p>{project.service || "Not specified"}</p>

          </div>

        </div>

        <div className="detail-card">

          <FaCalendarAlt />

          <div>

            <h4>Expected Delivery</h4>

            <p>{formatDate(project.dueDate)}</p>

          </div>

        </div>

        <div className="detail-card">

          <FaFlag />

          <div>

            <h4>Priority</h4>

            <p>{project.priority || "medium"}</p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default CurrentProject;
