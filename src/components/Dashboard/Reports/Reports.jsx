import { useEffect, useMemo, useState } from "react";
import "./Reports.css";

import {
  FaFilePdf,
  FaSearch,
} from "react-icons/fa";

import api from "../../../services/api";

const formatSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatMonth = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : "";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/reports", { params: { limit: 50 } })
      .then((res) => {
        if (cancelled) return;
        setReports(res.data?.data || []);
        setTotal(res.data?.pagination?.total ?? res.data?.data?.length ?? 0);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleReports = useMemo(() => {
    if (!search.trim()) return reports;
    const q = search.trim().toLowerCase();
    return reports.filter((r) => r.title.toLowerCase().includes(q));
  }, [reports, search]);

  const thisMonthCount = useMemo(() => {
    const now = new Date();
    return reports.filter((r) => {
      const created = new Date(r.createdAt);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;
  }, [reports]);

  return (
    <div className="reports">

      <div className="reports-header">

        <div>

          <h1>Reports</h1>

          <p>
            Your project and marketing reports.
          </p>

        </div>

        <div className="report-actions">

          <div className="report-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

      </div>

      {status === "loading" && <p className="reports-status">Loading reports...</p>}

      {status === "error" && (
        <p className="reports-status">
          We couldn't load your reports right now. Please try again shortly.
        </p>
      )}

      {status === "success" && visibleReports.length === 0 && (
        <p className="reports-status">
          {reports.length === 0 ? "No reports have been shared with you yet." : "No reports match your search."}
        </p>
      )}

      {status === "success" && visibleReports.length > 0 && (
        <div className="reports-grid">

          {visibleReports.map((item) => (

            <div
              key={item._id}
              className="report-card"
            >

              <div className="report-icon">

                <FaFilePdf />

              </div>

              <h3>{item.title}</h3>

              <p>{formatMonth(item.periodStart || item.createdAt)}</p>

              <span>{formatSize(item.file?.size) || item.reportType}</span>

              <span className="report-unavailable">Not available</span>

            </div>

          ))}

        </div>
      )}

      {/* ===========================
          REPORT SUMMARY
      =========================== */}

      <div className="report-summary">

        <div className="summary-card">

          <h3>Report Summary</h3>

          <div className="summary-item">
            <span>Total Reports</span>
            <strong>{total}</strong>
          </div>

          <div className="summary-item">
            <span>This Month</span>
            <strong>{thisMonthCount}</strong>
          </div>

        </div>

        <div className="summary-card">

          <h3>Report Categories</h3>

          <ul>

            <li>SEO Reports</li>

            <li>Google Ads Reports</li>

            <li>Social Media Reports</li>

            <li>Website Analytics</li>

            <li>Performance Reports</li>

          </ul>

        </div>

      </div>

    </div>
  );
};

export default Reports;
