import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

import "./MyServices.css";
import api from "../../../services/api";
import { formatGBP } from "../../../utils/billingFormat";

const BILLING_TYPE_LABELS = {
  "one-off": "one-off",
  monthly: "per month",
  quarterly: "per quarter",
  annual: "per year",
};

// "£799.00 per month" -- or null when no agreed price has been set.
const priceText = (s) =>
  typeof s.agreedPricePence === "number"
    ? `${formatGBP(s.agreedPricePence)}${s.billingType ? ` ${BILLING_TYPE_LABELS[s.billingType] || s.billingType}` : ""}`
    : null;

const STATUS_LABELS = {
  pending: "Pending",
  active: "Active",
  "on-hold": "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "Not set";

const ServiceDetailModal = ({ serviceId, onClose }) => {
  const [assignment, setAssignment] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    if (!serviceId) return;

    // Starts in "loading"; MyServices keys this modal by service id, so a
    // different service always mounts a fresh instance.
    let cancelled = false;

    api
      .get(`/client-services/${serviceId}`)
      .then((res) => {
        if (cancelled) return;
        setAssignment(res.data?.data || null);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  if (!serviceId) return null;

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        {status === "loading" && <p className="service-modal-status">Loading service...</p>}

        {status === "error" && (
          <p className="service-modal-status">This service could not be found.</p>
        )}

        {status === "success" && assignment && (
          <>
            <span className={`service-status status-${assignment.status}`}>
              {STATUS_LABELS[assignment.status] || assignment.status}
            </span>

            <h2>{assignment.service?.title || "Service"}</h2>

            {assignment.service?.description && (
              <p className="service-modal-description">{assignment.service.description}</p>
            )}

            <div className="service-modal-section">
              <h4>Delivery</h4>

              <div className="progress-header">
                <span>Progress</span>
                <strong>{assignment.progress ?? 0}%</strong>
              </div>

              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${assignment.progress ?? 0}%` }}></div>
              </div>

              <div className="service-modal-dates">
                <span>Started: {formatDate(assignment.startDate)}</span>
                <span>Ends: {formatDate(assignment.targetDate)}</span>
                {priceText(assignment) && <span>Agreed price: {priceText(assignment)}</span>}
                {assignment.status === "completed" && (
                  <span>Completed: {formatDate(assignment.completedAt)}</span>
                )}
              </div>
            </div>

            {assignment.description && (
              <div className="service-modal-section">
                <h4>About This Engagement</h4>
                <p>{assignment.description}</p>
              </div>
            )}

            {assignment.requirements && (
              <div className="service-modal-section">
                <h4>What We Need From You</h4>
                <p>{assignment.requirements}</p>
              </div>
            )}

            {assignment.clientActionRequired ? (
              <div className="service-modal-section service-modal-action">
                <h4>Action Required</h4>
                <p>{assignment.clientActionRequired}</p>
              </div>
            ) : (
              <p className="service-modal-status">Nothing is currently needed from you for this service.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailModal;
