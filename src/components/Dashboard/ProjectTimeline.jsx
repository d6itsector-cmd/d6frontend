import { useEffect, useState } from "react";
import "./ProjectTimeline.css";

import {
  FaCheckCircle,
  FaFlag,
  FaExclamationTriangle,
  FaRegCircle,
} from "react-icons/fa";

import api from "../../services/api";

const ICONS = {
  completed: FaCheckCircle,
  milestone: FaFlag,
  issue: FaExclamationTriangle,
  update: FaRegCircle,
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

const ProjectTimeline = () => {
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | empty | error

  useEffect(() => {
    let cancelled = false;

    api
      .get("/projects", { params: { limit: 1 } })
      .then((res) => {
        const project = res.data?.data?.[0];

        if (!project) {
          if (!cancelled) setStatus("empty");
          return null;
        }

        return api.get(`/projects/${project._id}/timeline`);
      })
      .then((res) => {
        if (cancelled || !res) return;
        setEntries(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading" || status === "empty") {
    return null;
  }

  return (
    <section className="timeline-section">

      <div className="timeline-header">

        <h2>Project Timeline</h2>

        <p>
          Follow every stage of your project from planning to deployment.
        </p>

      </div>

      {status === "error" && (
        <p className="timeline-status">
          We couldn't load your project timeline right now.
        </p>
      )}

      {status === "success" && entries.length === 0 && (
        <p className="timeline-status">No updates have been posted yet.</p>
      )}

      {status === "success" && entries.length > 0 && (
        <div className="timeline">

          {entries.map((item) => {
            const Icon = ICONS[item.type] || FaRegCircle;

            return (
              <div
                className={`timeline-item ${item.type || "update"}`}
                key={item._id}
              >

                <div className="timeline-icon">
                  <Icon />
                </div>

                <div className="timeline-content">

                  <h4>{item.title}</h4>

                  <span>{formatDate(item.eventDate)}</span>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
};

export default ProjectTimeline;
