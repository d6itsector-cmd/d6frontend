import "./KpiCards.css";

// summary comes from the same GET /api/dashboard call Hero/CurrentProject/
// RecentActivity already share (Dashboard.jsx) -- no separate fetch, no
// fabricated numbers. Shows "-" while loading/on error rather than a false 0.
const KpiCards = ({ summary, status }) => {
  const val = (n) => (status === "success" ? n ?? 0 : "-");

  const cards = [
    { label: "Active Services", value: val(summary?.services?.active) },
    { label: "Active Projects", value: val(summary?.projects?.active) },
    { label: "Completed Services", value: val(summary?.services?.completed) },
    { label: "Documents", value: val(summary?.documents?.total) },
  ];

  return (
    <div className="kpi-stats">
      {cards.map((c) => (
        <div className="kpi-box" key={c.label}>
          <h2>{c.value}</h2>
          <p>{c.label}</p>
        </div>
      ))}
    </div>
  );
};

export default KpiCards;
