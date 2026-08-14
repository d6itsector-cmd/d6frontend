import "./DashboardCards.css";

import {
  FaUsers,
  FaProjectDiagram,
  FaUserFriends,
  FaHeadset,
} from "react-icons/fa";

import StatsCard from "./StatsCard";

const DashboardCards = ({ summary }) => {
  const openTickets = (summary?.support?.open || 0) + (summary?.support?.inProgress || 0);

  return (
    <div className="dashboard-cards">

      <StatsCard
        title="Clients"
        value={summary?.users?.clients ?? "-"}
        icon={<FaUsers />}
        color="#14213D"
      />

      <StatsCard
        title="Projects"
        value={summary?.projects?.total ?? "-"}
        icon={<FaProjectDiagram />}
        color="#0077CC"
      />

      <StatsCard
        title="Leads"
        value={summary?.leads?.total ?? "-"}
        icon={<FaUserFriends />}
        color="#22c55e"
      />

      <StatsCard
        title="Open Support Tickets"
        value={openTickets}
        icon={<FaHeadset />}
        color="#0077CC"
      />

    </div>
  );
};

export default DashboardCards;
