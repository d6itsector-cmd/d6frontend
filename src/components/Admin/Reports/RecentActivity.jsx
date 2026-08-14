import { useEffect, useState } from "react";
import "./RecentActivity.css";

import {
  FaProjectDiagram,
  FaEnvelope,
  FaCalendarCheck,
  FaUserCheck,
} from "react-icons/fa";

import api from "../../../services/api";

const RecentActivity = () => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => {
        const overview = res.data?.data;
        const merged = [
          ...(overview?.recentProjects || []).map((p) => ({
            icon: <FaProjectDiagram />,
            text: `New project "${p.name}" for ${p.client?.displayName || p.client?.email || "a client"}`,
            date: p.createdAt,
          })),
          ...(overview?.recentContacts || []).map((c) => ({
            icon: <FaEnvelope />,
            text: `Contact request from ${c.name}`,
            date: c.createdAt,
          })),
          ...(overview?.recentConsultations || []).map((c) => ({
            icon: <FaCalendarCheck />,
            text: `Consultation requested by ${c.name}`,
            date: c.createdAt,
          })),
          ...(overview?.recentUsers || []).map((u) => ({
            icon: <FaUserCheck />,
            text: `${u.role === "client" ? "New client" : "New user"} registered: ${u.displayName || u.email}`,
            date: u.createdAt,
          })),
        ];
        merged.sort((a, b) => new Date(b.date) - new Date(a.date));
        setItems(merged.slice(0, 6));
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="activity-card">

      <h2>Recent Activity</h2>

      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p>We couldn't load recent activity right now.</p>}
      {status === "success" && items.length === 0 && <p>No recent activity yet.</p>}

      {status === "success" && items.length > 0 && (
        <ul>
          {items.map((item, i) => (
            <li key={i}>
              <span className="activity-icon">{item.icon}</span>
              {item.text}
            </li>
          ))}
        </ul>
      )}

    </div>
  );
};

export default RecentActivity;
