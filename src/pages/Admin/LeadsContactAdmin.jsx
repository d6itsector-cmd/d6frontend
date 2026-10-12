import "../../components/Billing/Billing.css";

import { NavLink, Outlet } from "react-router-dom";

// /admin/leads shell: one sidebar item with three tabs. Each tab is the
// existing standalone page rendered `embedded` (no own header/padding).
const TABS = [
  { to: "/admin/leads", label: "Leads", end: true },
  { to: "/admin/leads/contact-requests", label: "Contact Requests" },
  { to: "/admin/leads/consultations", label: "Consultations" },
];

const LeadsContactAdmin = () => (
  <div className="bl-admin">
    <div className="bl-page-header">
      <div>
        <h1>Leads &amp; Contact Requests</h1>
        <p>Inbound inquiries and contact enquiries received from your website.</p>
      </div>
    </div>

    <nav className="bl-tabs" aria-label="Leads and contact request sections">
      {TABS.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => `bl-tab ${isActive ? "active" : ""}`}>
          {tab.label}
        </NavLink>
      ))}
    </nav>

    <Outlet />
  </div>
);

export default LeadsContactAdmin;
