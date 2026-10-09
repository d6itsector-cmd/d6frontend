import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import "./Dashboard.css";

import Sidebar from "../../components/Dashboard/Sidebar";
import Topbar from "../../components/Dashboard/Topbar";

import Hero from "../../components/Dashboard/DashboardHero";
import KpiCards from "../../components/Dashboard/KpiCards";
import ActionRequired from "../../components/Dashboard/ActionRequired";
import OnboardingWelcome from "../../components/Dashboard/OnboardingWelcome";
import CurrentProject from "../../components/Dashboard/CurrentProject";
import ProjectTimeline from "../../components/Dashboard/ProjectTimeline";
import RecentActivity from "../../components/Dashboard/RecentActivity";
import Documents from "../../components/Dashboard/Documents";

// New Components
import MyProjects from "../../components/Dashboard/Myproject/MyProjects";
import MyServices from "../../components/Dashboard/Services/MyServices";
import Analytics from "../../components/Dashboard/Analytics/Analytics";
import Reports from "../../components/Dashboard/Reports/Reports";
import Messages from "../../components/Dashboard/Messages/Messages";
import Support from "../../components/Dashboard/Support/Support";
import Settings from "../../components/Dashboard/Settings/Settings";

// Billing
import MyPlan from "../../components/Dashboard/Billing/MyPlan";
import BillingPayments from "../../components/Dashboard/Billing/BillingPayments";
import CheckoutResult from "../../components/Dashboard/Billing/CheckoutResult";
import BillingOverview from "../../components/Dashboard/Billing/BillingOverview";

import api from "../../services/api";

// Each section lives at /dashboard/<id> so pages can be linked to directly
// (Stripe redirects to /dashboard/billing/success|cancelled and the billing
// portal returns to /dashboard/my-plan).
const SECTIONS = [
  "projects",
  "services",
  "analytics",
  "reports",
  "messages",
  "support",
  "settings",
  "my-plan",
  "billing",
  "billing/success",
  "billing/cancelled",
];

const Dashboard = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const section = location.pathname.replace(/^\/dashboard\/?/, "").replace(/\/+$/, "");
  const activePage = section || "dashboard";
  const isKnownSection = !section || SECTIONS.includes(section);

  const setActivePage = (id) => {
    navigate(id === "dashboard" ? "/dashboard" : `/dashboard/${id}`);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Loaded once here (not per-card) and shared by Hero/CurrentProject/RecentActivity.
  const [overview, setOverview] = useState(null);
  const [overviewStatus, setOverviewStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    let cancelled = false;

    api
      .get("/dashboard")
      .then((res) => {
        if (cancelled) return;
        setOverview(res.data?.data || null);
        setOverviewStatus("success");
      })
      .catch(() => {
        if (!cancelled) setOverviewStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currentProject = overview?.currentProjects?.[0] || null;
  const currentProjectStatus =
    overviewStatus === "loading"
      ? "loading"
      : overviewStatus === "error"
      ? "error"
      : currentProject
      ? "success"
      : "empty";

  const summary = overview?.summary;
  const isBrandNewClient =
    overviewStatus === "success" &&
    !!summary &&
    (summary.services?.total || 0) === 0 &&
    (summary.projects?.total || 0) === 0 &&
    (summary.documents?.total || 0) === 0 &&
    (summary.reports?.total || 0) === 0;

  const renderPage = () => {

    switch (activePage) {

      case "projects":
        return <MyProjects />;

      case "services":
        return <MyServices />;

      case "analytics":
        return <Analytics />;

      case "reports":
        return <Reports />;

      case "messages":
        return <Messages />;

      case "support":
        return <Support />;

      case "settings":
        return <Settings />;

      case "my-plan":
        return <MyPlan setActivePage={setActivePage} />;

      case "billing":
        return <BillingPayments />;

      case "billing/success":
        return <CheckoutResult outcome="success" setActivePage={setActivePage} />;

      case "billing/cancelled":
        return <CheckoutResult outcome="cancelled" setActivePage={setActivePage} />;

      default:
        return (
          <>
            <Hero project={currentProject} status={currentProjectStatus} setActivePage={setActivePage} />

            <div className="dashboard-body">

              <KpiCards summary={summary} status={overviewStatus} />

              <BillingOverview setActivePage={setActivePage} />

              {overviewStatus === "success" && (
                <ActionRequired
                  recentReportsCount={summary?.reports?.recent || 0}
                  setActivePage={setActivePage}
                />
              )}

              {isBrandNewClient ? (
                <OnboardingWelcome setActivePage={setActivePage} />
              ) : (
                <CurrentProject project={currentProject} status={currentProjectStatus} />
              )}

              <div className="dashboard-row">

                <ProjectTimeline />

                <RecentActivity items={overview?.recentActivity} status={overviewStatus} />

              </div>

              <Documents />

            </div>
          </>
        );
    }

  };

  if (!isKnownSection) {
    return <Navigate to="/dashboard" replace />;
  }

  return (

    <div className="dashboard">

      <Sidebar
        activePage={activePage.split("/")[0]}
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div className="dashboard-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="dashboard-content">

        <Topbar
          onMenuClick={() => setSidebarOpen((open) => !open)}
          showGreeting={activePage !== "dashboard"}
        />

        {renderPage()}

      </div>

    </div>

  );

};

export default Dashboard;