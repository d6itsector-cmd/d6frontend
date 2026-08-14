import { useEffect, useState } from "react";
import "./RecentActivity.css";

import {
  FaFlag,
  FaFileAlt,
  FaComments,
  FaCloudUploadAlt,
  FaHeadset,
} from "react-icons/fa";

import api from "../../services/api";

const ICONS = {
  timeline: <FaFlag />,
  report: <FaFileAlt />,
  message: <FaComments />,
  document: <FaCloudUploadAlt />,
  support: <FaHeadset />,
};

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  if (isToday) return `Today • ${time}`;
  if (isYesterday) return `Yesterday • ${time}`;

  return `${date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} • ${time}`;
};

// items/status are supplied initially by Dashboard.jsx from a single
// GET /api/dashboard call; "View All" fetches the fuller feed on demand.
const RecentActivity = ({ items: initialItems, status: initialStatus }) => {
  const [items, setItems] = useState(initialItems || []);
  const [status, setStatus] = useState(initialStatus || "loading");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded) return;
    setItems(initialItems || []);
    setStatus(initialStatus || "loading");
  }, [initialItems, initialStatus, expanded]);

  const handleViewAll = () => {
    setExpanded(true);
    setStatus("loading");

    api
      .get("/dashboard/activity", { params: { limit: 50 } })
      .then((res) => {
        setItems(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  return (
    <section className="activity-section">

      <div className="activity-header">

        <div>
          <h2>Recent Activity</h2>
          <p>Latest updates from your project team.</p>
        </div>

        <button onClick={handleViewAll}>View All</button>

      </div>

      {status === "loading" && <p className="activity-status-msg">Loading activity...</p>}

      {status === "error" && (
        <p className="activity-status-msg">We couldn't load your recent activity right now.</p>
      )}

      {status === "success" && items.length === 0 && (
        <p className="activity-status-msg">No recent activity yet.</p>
      )}

      {status === "success" && items.length > 0 && (
        <div className="activity-list">

          {items.map((item, index) => (

            <div
              className={`activity-card ${item.type}`}
              key={index}
            >

              <div className="activity-icon">
                {ICONS[item.type] || <FaFileAlt />}
              </div>

              <div className="activity-content">

                <h4>{item.title}</h4>

                <p>{item.description}</p>

              </div>

              <span>{formatTime(item.timestamp)}</span>

            </div>

          ))}

        </div>
      )}

    </section>
  );
};

export default RecentActivity;
