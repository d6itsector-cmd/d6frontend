import "./Sidebar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../assets/d6.png";
import {
  FaTachometerAlt,
  FaUsers,
  FaProjectDiagram,
  FaUserFriends,
  FaEnvelope,
  FaCalendarCheck,
  FaCog,
  FaServicestack,
  FaImages,
  FaBlog,
  FaChartBar,
  FaSignOutAlt,
  FaFileAlt,
  FaComments,
} from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/");
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/admin",
    },
    {
      name: "Clients",
      icon: <FaUsers />,
      path: "/admin/clients",
    },
    {
      name: "Projects",
      icon: <FaProjectDiagram />,
      path: "/admin/projects",
    },
    {
      name: "Leads",
      icon: <FaUserFriends />,
      path: "/admin/leads",
    },
    {
      name: "Contact Requests",
      icon: <FaEnvelope />,
      path: "/admin/contact-requests",
    },
    {
      name: "Consultations",
      icon: <FaCalendarCheck />,
      path: "/admin/consultations",
    },
    {
      name: "Services",
      icon: <FaServicestack />,
      path: "/admin/services",
    },
    {
      name: "Portfolio",
      icon: <FaImages />,
      path: "/admin/portfolio",
    },
    {
      name: "Blogs",
      icon: <FaBlog />,
      path: "/admin/blogs",
    },
    {
      name: "Reports",
      icon: <FaChartBar />,
      path: "/admin/reports",
    },
    {
      name: "Documents",
      icon: <FaFileAlt />,
      path: "/admin/documents",
    },
    {
      name: "Messages",
      icon: <FaComments />,
      path: "/admin/messages",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/admin/settings",
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <Link to="/" className="sidebar-logo" onClick={onClose}>
        <img src={logo} alt="D6 Global Media" />
        <h2>D6 Global Media</h2>
        <span>Admin Panel</span>
      </Link>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/admin"}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;