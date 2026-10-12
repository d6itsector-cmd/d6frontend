import "./Sidebar.css";

import { Link, useNavigate } from "react-router-dom";

import {
    FaHome,
    FaChartLine,
    FaFileAlt,
    FaComments,
    FaHeadset,
    FaCog,
    FaSignOutAlt,
    FaGlobe,
    FaFileInvoiceDollar,
    FaCreditCard,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/d6.png";
const Sidebar = ({ activePage, setActivePage, isOpen, onClose }) => {

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleSelect = (id) => {
        setActivePage(id);
        if (onClose) onClose();
    };

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate("/");
        }
    };

    const menu = [

        {
            id: "dashboard",
            title: "Dashboard",
            icon: <FaHome />,
        },

        {
            id: "analytics",
            title: "Analytics",
            icon: <FaChartLine />,
        },

        {
            id: "my-plan",
            title: "My Plan",
            icon: <FaFileInvoiceDollar />,
        },

        {
            id: "billing",
            title: "Billing",
            icon: <FaCreditCard />,
        },

        {
            id: "reports",
            title: "Reports",
            icon: <FaFileAlt />,
        },

        {
            id: "messages",
            title: "Messages",
            icon: <FaComments />,
        },

        {
            id: "support",
            title: "Support",
            icon: <FaHeadset />,
        },

        {
            id: "settings",
            title: "Settings",
            icon: <FaCog />,
        },

    ];

    return (

        <aside className={`sidebar ${isOpen ? "open" : ""}`}>

            <Link to="/" className="sidebar-logo" onClick={onClose}>

                <div className="logo-circle">

                    <img src={logo} alt="D6 Global Services" />

                </div>

                <div>

                    <h2>D6 Global Services</h2>

                    <p>Dashboard</p>

                </div>

            </Link>

            <span className="menu-title">

                MAIN MENU

            </span>

            <nav>

                {menu.map((item) => (

                    <button

                        key={item.id}

                        onClick={() => handleSelect(item.id)}

                        className={
                            activePage === item.id
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }

                    >

                        <span className="menu-icon">

                            {item.icon}

                        </span>

                        {item.title}

                    </button>

                ))}

            </nav>

            <Link to="/" className="view-website-link" onClick={onClose}>
                <FaGlobe />
                View Website
            </Link>

            <button className="logout-btn" onClick={handleLogout}>

                <FaSignOutAlt />

                Logout

            </button>

        </aside>

    );

};

export default Sidebar;