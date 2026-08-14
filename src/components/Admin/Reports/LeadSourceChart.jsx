import "./LeadSourceChart.css";

// Contact.source exists in the schema, but every current submission path
// hardcodes source: "website" -- there is no real variety to chart yet, so
// this shows an honest state instead of a misleading single-slice "pie"
// (Phase 8H). Revisit once multiple lead sources are actually captured.
const LeadSourceChart = () => {
  return (
    <div className="chart-card">

      <h2>Lead Sources</h2>

      <div className="chart-placeholder">
        All current leads originate from the website contact form. This chart
        will be meaningful once additional lead sources are tracked.
      </div>

    </div>
  );
};

export default LeadSourceChart;
