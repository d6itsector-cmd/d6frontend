import { useEffect, useState } from "react";
import "./ActionRequired.css";

import { FaExclamationCircle, FaFileAlt } from "react-icons/fa";

import api from "../../services/api";

// Reuses the existing client-scoped GET /client-services endpoint (no new
// API). Only ever renders items backed by real fields: an assignment's own
// clientActionRequired text, or the server-computed "reports created in the
// last 30 days" count from the dashboard summary. If neither is true, this
// renders nothing -- an empty "all caught up" box is not shown, per the
// Phase 16 rule against artificial warnings.
const ActionRequired = ({ recentReportsCount, setActivePage }) => {
  const [pendingActions, setPendingActions] = useState([]);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/client-services", { params: { limit: 50 } })
      .then((res) => {
        if (cancelled) return;
        const items = (res.data?.data || []).filter((s) => s.clientActionRequired);
        setPendingActions(items);
      })
      .catch(() => {
        // Non-critical section -- fail silently, section simply won't show.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const hasReports = (recentReportsCount || 0) > 0;

  if (pendingActions.length === 0 && !hasReports) return null;

  return (
    <section className="action-required">
      <h2>Action Required</h2>

      <div className="action-list">
        {pendingActions.map((s) => (
          <div className="action-item" key={s._id}>
            <span className="action-icon">
              <FaExclamationCircle />
            </span>

            <div>
              <h4>{s.service?.title || "Service"}</h4>
              <p>{s.clientActionRequired}</p>
            </div>

            <button onClick={() => setActivePage("services")}>View</button>
          </div>
        ))}

        {hasReports && (
          <div className="action-item">
            <span className="action-icon">
              <FaFileAlt />
            </span>

            <div>
              <h4>New report{recentReportsCount > 1 ? "s" : ""} available</h4>
              <p>
                {recentReportsCount} new report{recentReportsCount > 1 ? "s have" : " has"} been added
                recently.
              </p>
            </div>

            <button onClick={() => setActivePage("reports")}>View</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActionRequired;
