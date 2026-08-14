import { useEffect, useState } from "react";
import "./MyServices.css";

import { FaBriefcase, FaCalendarAlt } from "react-icons/fa";

import api from "../../../services/api";
import ServiceDetailModal from "./ServiceDetailModal";

const STATUS_LABELS = {
  pending: "Pending",
  active: "Active",
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

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/client-services", { params: { limit: 50 } })
      .then((res) => {
        if (cancelled) return;
        setServices(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const total = services.length;
  const active = services.filter((s) => s.status === "active").length;
  const completed = services.filter((s) => s.status === "completed").length;
  const actionNeeded = services.filter((s) => s.clientActionRequired).length;

  return (
    <div className="services-page">
      <div className="services-header">
        <div>
          <h1>My Services</h1>
          <p>The services your account team is currently delivering for you.</p>
        </div>
      </div>

      <div className="service-stats">
        <div className="stat-box">
          <h2>{total}</h2>
          <p>Total Services</p>
        </div>

        <div className="stat-box">
          <h2>{active}</h2>
          <p>Active</p>
        </div>

        <div className="stat-box">
          <h2>{completed}</h2>
          <p>Completed</p>
        </div>

        <div className="stat-box">
          <h2>{actionNeeded}</h2>
          <p>Action Needed</p>
        </div>
      </div>

      {status === "loading" && <p className="services-status">Loading your services...</p>}

      {status === "error" && (
        <p className="services-status">
          We couldn't load your services right now. Please try again shortly.
        </p>
      )}

      {status === "success" && services.length === 0 && (
        <p className="services-status">
          No services have been assigned yet. Your account team will add the services agreed
          during your consultation.
        </p>
      )}

      {status === "success" && services.length > 0 && (
        <div className="services-grid">
          {services.map((s) => (
            <div className="service-card" key={s._id}>
              <div className="service-top">
                <div className="service-icon">
                  <FaBriefcase />
                </div>

                <span className={`service-status status-${s.status}`}>
                  {STATUS_LABELS[s.status] || s.status}
                </span>
              </div>

              <h3>{s.service?.title || "Service"}</h3>

              {s.service?.shortDescription && <p className="service-desc">{s.service.shortDescription}</p>}

              <div className="progress-header">
                <span>Progress</span>
                <strong>{s.progress ?? 0}%</strong>
              </div>

              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${s.progress ?? 0}%` }}></div>
              </div>

              <div className="service-info">
                <div>
                  <FaCalendarAlt />
                  <span>Started: {formatDate(s.startDate)}</span>
                </div>

                <div>
                  <FaCalendarAlt />
                  <span>Target: {formatDate(s.targetDate)}</span>
                </div>
              </div>

              {s.clientActionRequired && (
                <p className="service-action-required">Action required: {s.clientActionRequired}</p>
              )}

              <button className="details-btn" onClick={() => setSelectedId(s._id)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedId && <ServiceDetailModal serviceId={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
};

export default MyServices;
