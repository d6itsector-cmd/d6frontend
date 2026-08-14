import { useEffect, useState } from "react";
import "./Analytics.css";

import {
  FaProjectDiagram,
  FaChartLine,
  FaHeadset,
  FaCheckCircle,
} from "react-icons/fa";

import api from "../../../services/api";

const RANGE_OPTIONS = [
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "6m", label: "Last 6 Months" },
  { value: "12m", label: "Last 12 Months" },
];

const STATUS_LABELS = {
  planning: "Planning",
  active: "Active",
  "on-hold": "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
  open: "Open",
  "in-progress": "In Progress",
  "waiting-client": "Waiting on You",
  resolved: "Resolved",
  closed: "Closed",
};

const monthLabel = (value) => {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const Analytics = () => {
  const [range, setRange] = useState("90d");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    api
      .get("/analytics", { params: { range } })
      .then((res) => {
        if (cancelled) return;
        setData(res.data?.data || null);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [range]);

  const openTickets =
    data?.supportStatus
      ?.filter((s) => s.status === "open" || s.status === "in-progress")
      .reduce((sum, s) => sum + s.count, 0) || 0;

  const projectStatusTotal =
    data?.projectStatus?.reduce((sum, s) => sum + s.count, 0) || 0;

  const maxMonthCount = Math.max(1, ...(data?.reportsByMonth?.map((r) => r.count) || [0]));

  return (
    <div className="analytics">

      {/* Header */}

      <div className="analytics-header">

        <div>
          <h1>Analytics Dashboard</h1>
          <p>Application analytics based on your account activity.</p>
        </div>

        <select value={range} onChange={(e) => setRange(e.target.value)}>
          {RANGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

      </div>

      {status === "loading" && <p className="analytics-status-msg">Loading analytics...</p>}

      {status === "error" && (
        <p className="analytics-status-msg">We couldn't load your analytics right now.</p>
      )}

      {status === "success" && (
        <>

          {/* KPI Cards */}

          <div className="analytics-cards">

            <div className="analytics-card">
              <div className="analytics-icon"><FaProjectDiagram /></div>
              <div className="analytics-content">
                <span>Total Projects</span>
                <h2>{data.projectProgress.totalProjects}</h2>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-icon"><FaChartLine /></div>
              <div className="analytics-content">
                <span>Average Progress</span>
                <h2>{data.projectProgress.averageProgress}%</h2>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-icon"><FaCheckCircle /></div>
              <div className="analytics-content">
                <span>Completed Projects</span>
                <h2>{data.projectProgress.completedProjects}</h2>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-icon"><FaHeadset /></div>
              <div className="analytics-content">
                <span>Open Support Tickets</span>
                <h2>{openTickets}</h2>
              </div>
            </div>

          </div>

          {/* Reports by Month */}

          <div className="traffic-card">

            <div className="traffic-title">
              <h2>Reports Over Time</h2>
              <span>Reports delivered per month</span>
            </div>

            {data.reportsByMonth.length === 0 ? (
              <p className="analytics-status-msg">No reports have been generated in this period yet.</p>
            ) : (
              <div className="traffic-chart">
                {data.reportsByMonth.map((row) => (
                  <div
                    key={row.month}
                    className="bar"
                    style={{ height: `${Math.max(6, (row.count / maxMonthCount) * 100)}%` }}
                    title={`${monthLabel(row.month)}: ${row.count}`}
                  ></div>
                ))}
              </div>
            )}

            {data.reportsByMonth.length > 0 && (
              <div className="analytics-bar-labels">
                {data.reportsByMonth.map((row) => (
                  <span key={row.month}>{monthLabel(row.month)}</span>
                ))}
              </div>
            )}

          </div>

          {/* Project Status Distribution */}

          <div className="traffic-sources">

            <h2>Project Status Distribution</h2>

            {data.projectStatus.length === 0 ? (
              <p className="analytics-status-msg">You don't have any projects in this period yet.</p>
            ) : (
              data.projectStatus.map((row) => (
                <div className="source" key={row.status}>
                  <span>{STATUS_LABELS[row.status] || row.status}</span>
                  <div className="source-bar">
                    <div
                      style={{
                        width: `${projectStatusTotal ? Math.round((row.count / projectStatusTotal) * 100) : 0}%`,
                      }}
                    ></div>
                  </div>
                  <strong>{row.count}</strong>
                </div>
              ))
            )}

          </div>

          {/* Support Ticket Status */}

          <div className="campaign-card">

            <h2>Support Ticket Status</h2>

            {data.supportStatus.length === 0 ? (
              <p className="analytics-status-msg">No support tickets in this period.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Tickets</th>
                  </tr>
                </thead>
                <tbody>
                  {data.supportStatus.map((row) => (
                    <tr key={row.status}>
                      <td>{STATUS_LABELS[row.status] || row.status}</td>
                      <td>{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>

        </>
      )}

    </div>
  );
};

export default Analytics;
