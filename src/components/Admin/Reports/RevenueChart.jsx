import "./RevenueChart.css";

// No billing/revenue model exists in this system yet -- an honest
// "integration required" state instead of a fabricated number (Phase 8H).
const RevenueChart = () => {
  return (
    <div className="chart-card">

      <h2>Monthly Revenue</h2>

      <div className="chart-placeholder">
        Revenue tracking requires a future billing integration.
      </div>

    </div>
  );
};

export default RevenueChart;
