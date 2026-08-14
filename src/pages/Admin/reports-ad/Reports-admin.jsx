import "./Reports-admin.css";

import ReportCards from "../../../components/Admin/Reports/ReportCards";
import RevenueChart from "../../../components/Admin/Reports/RevenueChart";
import LeadSourceChart from "../../../components/Admin/Reports/LeadSourceChart";
import RecentActivity from "../../../components/Admin/Reports/RecentActivity";
import ReportManagementTable from "../../../components/Admin/Reports/ReportManagementTable";

const ReportsAdmin = () => {
  return (
    <div className="reports-page">

      {/* Header */}

      <div className="reports-header">

        <div>
          <h1>Reports & Analytics</h1>

          <p>
            Monitor your business growth, leads, projects, clients and
            website performance from one dashboard.
          </p>
        </div>

      </div>

      {/* Statistics Cards */}

      <ReportCards />

      {/* Charts */}

      <div className="chart-section">

        <RevenueChart />

        <LeadSourceChart />

      </div>

      {/* Recent Activities */}

      <RecentActivity />

      {/* Report Management -- the actual Report model, distinct from the
          business-analytics cards/charts above (Phase 8H report) */}

      <ReportManagementTable />

    </div>
  );
};

export default ReportsAdmin;