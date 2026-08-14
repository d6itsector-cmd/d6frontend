import "./StatsCard.css";

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="admin-stats-card">
      <div
        className="admin-stats-icon"
        style={{ background: color }}
      >
        {icon}
      </div>

      <div className="stats-content">
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
};

export default StatsCard;