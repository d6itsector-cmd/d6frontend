import { useEffect, useState } from "react";
import "./MyProjects.css";

import {
  FaGlobe,
  FaCalendarAlt,
  FaFlag,
  FaPoundSign,
} from "react-icons/fa";

import api from "../../../services/api";
import { formatGBP } from "../../../utils/billingFormat";

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

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [counts, setCounts] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    let cancelled = false;

    // Counts come from the server's per-status aggregation (the same numbers
    // as the dashboard KPIs), not from this page's first 50 projects.
    Promise.all([api.get("/projects", { params: { limit: 50 } }), api.get("/dashboard/summary")])
      .then(([list, summary]) => {
        if (cancelled) return;
        setProjects(list.data?.data || []);
        setCounts(summary.data?.data?.projects || null);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const count = (key) => (status === "success" ? counts?.[key] ?? 0 : "-");
  const total = count("total");
  const inProgress = count("active");
  const completed = count("completed");
  const planning = count("planning");

  return (
    <div className="projects-page">

      <div className="projects-header">

        <div>
          <h1>My Projects</h1>

          <p>
            Track all your active and completed projects in one place.
          </p>
        </div>

      </div>

      <div className="project-stats">

        <div className="stat-box">
          <h2>{total}</h2>
          <p>Total Projects</p>
        </div>

        <div className="stat-box">
          <h2>{inProgress}</h2>
          <p>In Progress</p>
        </div>

        <div className="stat-box">
          <h2>{completed}</h2>
          <p>Completed</p>
        </div>

        <div className="stat-box">
          <h2>{planning}</h2>
          <p>Planning</p>
        </div>

      </div>

      {status === "loading" && <p className="projects-status">Loading your projects...</p>}

      {status === "error" && (
        <p className="projects-status">
          We couldn't load your projects right now. Please try again shortly.
        </p>
      )}

      {status === "success" && projects.length === 0 && (
        <p className="projects-status">
          You don't have any projects yet. Your assigned projects will appear here.
        </p>
      )}

      {status === "success" && projects.length > 0 && (
        <div className="projects-grid">

          {projects.map((project) => (

            <div
              className="project-card"
              key={project._id}
            >

              <div className="project-top">

                <div className="project-icon">
                  <FaGlobe />
                </div>

                <span className="project-status">
                  {STATUS_LABELS[project.status] || project.status}
                </span>

              </div>

              <h3>{project.name}</h3>

              <div className="progress-header">

                <span>Progress</span>

                <strong>{project.progress ?? 0}%</strong>

              </div>

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${project.progress ?? 0}%`,
                  }}
                ></div>

              </div>

              {project.linkedServices?.length > 0 && (
                <div className="project-services" aria-label="Services in this project">
                  {project.linkedServices.map((s) => (
                    <span key={s._id} className="project-service-chip">
                      {s.service?.title || "Service"}
                    </span>
                  ))}
                </div>
              )}

              <div className="project-info">

                <div>
                  <FaFlag />
                  <span>{project.priority || "medium"} priority</span>
                </div>

                <div>
                  <FaCalendarAlt />
                  <span>Start {formatDate(project.startDate)}</span>
                </div>

                <div>
                  <FaCalendarAlt />
                  <span>Due {formatDate(project.dueDate)}</span>
                </div>

                {typeof project.budgetPence === "number" && (
                  <div>
                    <FaPoundSign />
                    <span>Budget {formatGBP(project.budgetPence)}</span>
                  </div>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default MyProjects;
