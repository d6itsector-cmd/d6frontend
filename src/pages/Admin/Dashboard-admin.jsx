import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt, FaUsers } from "react-icons/fa";
import "./Dashboard-admin.css";
import DashboardCards from "../../components/Admin/Dashboard/DashboardCards";
import api from "../../services/api";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

const STATUS_COLORS = {
  active: "#22C55E", completed: "#22C55E", new: "#0077CC", open: "#0077CC",
  cancelled: "#EF4444", closed: "#999", "on-hold": "#0077CC",
};

// Normalizes the admin dashboard's separate recent-* lists into one feed,
// mirroring the same "merge real sources, don't fabricate" approach used on
// the client dashboard (Phase 8G).
const buildActivity = (overview) => {
  if (!overview) return [];

  const items = [
    ...(overview.recentProjects || []).map((p) => ({
      client: p.client?.displayName || p.client?.email || "-",
      detail: `Project: ${p.name}`,
      status: p.status,
      date: p.createdAt,
    })),
    ...(overview.recentContacts || []).map((c) => ({
      client: c.name,
      detail: `Contact request: ${c.subject || "General enquiry"}`,
      status: c.status,
      date: c.createdAt,
    })),
    ...(overview.recentConsultations || []).map((c) => ({
      client: c.name,
      detail: `Consultation: ${c.service}`,
      status: c.status,
      date: c.createdAt,
    })),
    ...(overview.recentSupportTickets || []).map((t) => ({
      client: t.client?.displayName || t.client?.email || "-",
      detail: `Support: ${t.subject}`,
      status: t.status,
      date: t.createdAt,
    })),
  ];

  return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
};

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => {
        setOverview(res.data?.data || null);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  const activity = buildActivity(overview);

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="admin-dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin</p>
        </div>

        <Link to="/admin/projects" className="admin-dashboard-add-btn">
          + Add Project
        </Link>
      </div>

      {status === "error" && (
        <p className="status-message">We couldn't load the dashboard right now.</p>
      )}

      {/* Statistics Cards */}
      <DashboardCards summary={overview?.summary} />

      {/* Quick Overview */}
      <div className="admin-dashboard-panel">
        <h3>Quick Overview</h3>

        <div className="admin-dashboard-overview">
          <div className="admin-dashboard-overview-row">
            <span className="admin-dashboard-dot" style={{ background: "#22C55E" }} />
            Active Projects: {overview?.summary?.projects?.active ?? "-"}
          </div>
          <div className="admin-dashboard-overview-row">
            <span className="admin-dashboard-dot" style={{ background: "#F59E0B" }} />
            New Leads: {overview?.summary?.leads?.new ?? "-"}
          </div>
          <div className="admin-dashboard-overview-row">
            <span className="admin-dashboard-dot" style={{ background: "#0077CC" }} />
            Completed Projects: {overview?.summary?.projects?.completed ?? "-"}
          </div>
          <div className="admin-dashboard-overview-row">
            <FaTicketAlt className="admin-dashboard-icon" />
            Open Support Tickets: {overview?.summary?.support?.open ?? "-"}
          </div>
          <div className="admin-dashboard-overview-row">
            <FaUsers className="admin-dashboard-icon" />
            Total Clients: {overview?.summary?.users?.clients ?? "-"}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-dashboard-panel admin-dashboard-panel-mt">
        <h3>Recent Activity</h3>

        {status === "loading" && <p className="status-message">Loading...</p>}

        {status === "success" && activity.length === 0 && (
          <p className="status-message">No recent activity yet.</p>
        )}

        {status === "success" && activity.length > 0 && (
          <div className="admin-dashboard-table-wrap">
            <table className="admin-dashboard-table">
              <thead>
                <tr>
                  <th align="left">Client</th>
                  <th align="left">Activity</th>
                  <th align="left">Status</th>
                  <th align="left">Date</th>
                </tr>
              </thead>

              <tbody>
                {activity.map((item, i) => (
                  <tr key={i}>
                    <td>{item.client}</td>
                    <td>{item.detail}</td>
                    <td style={{ color: STATUS_COLORS[item.status] || "#666" }}>{item.status}</td>
                    <td>{formatDate(item.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
