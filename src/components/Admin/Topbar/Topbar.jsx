import "./Topbar.css";

import { FaBars } from "react-icons/fa";

import Notification from "./Notification";
import ProfileMenu from "./ProfileMenu";

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="admin-topbar">

      <div className="topbar-left">

        <button
          className="admin-menu-toggle"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <FaBars />
        </button>

        <h2>Admin Dashboard</h2>

      </div>

      <div className="topbar-right">

        <Notification />

        <ProfileMenu />

      </div>

    </header>
  );
};

export default Topbar;