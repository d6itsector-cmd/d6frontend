import { daysUntil } from "../../utils/billingFormat";

// Calendar days (Europe/London) until the backend-provided period end.
const DaysRemaining = ({ until }) => {
  const days = daysUntil(until);
  if (days === null) return <span className="bl-muted">—</span>;

  if (days < 0) return <span className="bl-days bl-days--over">Ended {Math.abs(days)} day{days === -1 ? "" : "s"} ago</span>;
  if (days === 0) return <span className="bl-days bl-days--soon">Ends today</span>;

  return (
    <span className={`bl-days ${days <= 7 ? "bl-days--soon" : ""}`}>
      {days} day{days === 1 ? "" : "s"}
    </span>
  );
};

export default DaysRemaining;
