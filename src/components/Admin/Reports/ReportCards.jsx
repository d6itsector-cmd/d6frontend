import { useEffect, useState } from "react";
import "./ReportCards.css";
import {
  FaUsers,
  FaProjectDiagram,
  FaUserFriends,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";

import api from "../../../services/api";

const ReportCards = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => setSummary(res.data?.data?.summary || null))
      .catch(() => setSummary(null));
  }, []);

  const reports = [
    { title: "Clients", value: summary?.users?.clients, icon: <FaUsers /> },
    { title: "Projects", value: summary?.projects?.total, icon: <FaProjectDiagram /> },
    { title: "Leads", value: summary?.leads?.total, icon: <FaUserFriends /> },
    { title: "Contact Requests", value: summary?.contacts?.total, icon: <FaEnvelope /> },
    { title: "Consultations", value: summary?.consultations?.total, icon: <FaCalendarAlt /> },
  ];

  return (
    <div className="report-cards">
      {reports.map((item) => (
        <div
          className="report-card"
          key={item.title}
        >
          <div className="report-icon">
            {item.icon}
          </div>

          <h2>{item.value ?? "-"}</h2>

          <p>{item.title}</p>
        </div>
      ))}
    </div>
  );
};

export default ReportCards;
