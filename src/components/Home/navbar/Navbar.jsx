import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useConsultation } from "../../../context/ConsultationContext";
import { useLoginModal } from "../../../context/LoginModalContext";
import { useAuth } from "../../../context/AuthContext";
import { useUserRole } from "../../../hooks/useUserRole";

import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaSearch,
  FaBullhorn,
  FaLaptopCode,
  FaShareAlt,
  FaEnvelope,
  FaUserCircle,
  FaUser,
  FaSignOutAlt,
  FaPhoneAlt,
} from "react-icons/fa";

import logo from "../../../assets/d6.png";
import "./Navbar.css";

const Navbar = () => {
  const { openConsultation } = useConsultation();
  const { openLogin } = useLoginModal();
  const { currentUser, logout } = useAuth();
  const { role } = useUserRole();

  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  const isServicesActive = location.pathname.startsWith("/services");

  /* =========================
     MOBILE RESPONSIVE
  ========================= */

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 992;

      setIsMobile(mobile);

      if (!mobile) {
        setMenuOpen(false);
        setDropdownOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =========================
     SERVICES
  ========================= */

  const services = [
    {
      title: "SEO",
      description: "Improve your Google Ranking",
      icon: <FaSearch />,
      path: "/services/seo",
    },
    {
      title: "Google Ads",
      description: "Generate High Quality Leads",
      icon: <FaBullhorn />,
      path: "/services/google-ads",
    },
    {
      title: "Social Media",
      description: "Grow Your Social Presence",
      icon: <FaShareAlt />,
      path: "/services/social-media",
    },
    {
      title: "Website Development",
      description: "Modern Business Websites",
      icon: <FaLaptopCode />,
      path: "/services/web-development",
    },
    {
      title: "Email Marketing",
      description: "Reach Your Customers",
      icon: <FaEnvelope />,
      path: "/services/email-marketing",
    },
  ];

  /* =========================
     HELPERS
  ========================= */

  const closeAllMenus = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setProfileOpen(false);
  };

  const handleConsultation = () => {
    closeAllMenus();
    openConsultation();
  };

  const handleLoginClick = () => {
    closeAllMenus();
    openLogin();
  };

  const handleLogout = async () => {
    closeAllMenus();

    try {
      await logout();
    } finally {
      navigate("/");
    }
  };

  const dashboardPath =
    role === "admin" ? "/admin" : "/dashboard";

  /* =========================
     NAVBAR
  ========================= */

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* =================================
            LOGO
        ================================= */}

        <NavLink
          to="/"
          className="navbar-logo"
          onClick={closeAllMenus}
        >
          <img
            src={logo}
            alt="D6 Global Media"
          />

          <span className="logo-text">
            D6 <span>Global Media</span>
          </span>
        </NavLink>

        {/* =================================
            MAIN NAVIGATION
        ================================= */}

        <nav
          className={`navbar-menu ${
            menuOpen ? "navbar-menu-open" : ""
          }`}
        >

          {/* HOME */}

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
            onClick={closeAllMenus}
          >
            Home
          </NavLink>

          {/* SERVICES */}

          <div
            className={`navbar-nav-item ${
              dropdownOpen ? "dropdown-open" : ""
            } ${
              isServicesActive ? "active" : ""
            }`}
            onMouseEnter={() => {
              if (!isMobile) {
                setDropdownOpen(true);
              }
            }}
            onMouseLeave={() => {
              if (!isMobile) {
                setDropdownOpen(false);
              }
            }}
          >
            <button
              type="button"
              className={`navbar-link services-toggle ${
                isServicesActive ? "active" : ""
              }`}
              onClick={() => {
                if (isMobile) {
                  setDropdownOpen(!dropdownOpen);
                }
              }}
            >
              <span>Services</span>

              <FaChevronDown
                className={
                  dropdownOpen
                    ? "services-arrow rotate"
                    : "services-arrow"
                }
              />
            </button>

            <div
              className={`services-dropdown ${
                dropdownOpen ? "show" : ""
              }`}
            >
              <div className="services-dropdown-header">
                <h4>Digital Marketing Services</h4>

                <p>
                  Everything you need to grow your business online.
                </p>
              </div>

              <div className="services-grid">
                {services.map((service) => (
                  <NavLink
                    key={service.title}
                    to={service.path}
                    className="service-item"
                    onClick={closeAllMenus}
                  >
                    <div className="service-icon">
                      {service.icon}
                    </div>

                    <div className="service-title">
                      <h5>{service.title}</h5>
                    </div>

                    <div className="service-description">
                      <p>{service.description}</p>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* OTHER LINKS */}

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
            onClick={closeAllMenus}
          >
            About
          </NavLink>

          <NavLink
            to="/industries"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
            onClick={closeAllMenus}
          >
            Industries
          </NavLink>

          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
            onClick={closeAllMenus}
          >
            Portfolio
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
            onClick={closeAllMenus}
          >
            Blog
          </NavLink>

          {/* CONTACT */}

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
            onClick={closeAllMenus}
          >
            Contact
          </NavLink>

          {/* CONTACT NUMBER */}

          <a
            href="tel:+44 330 088 8586"
            className="navbar-phone"
            aria-label="Call D6 Global Media"
          >
            <FaPhoneAlt />
            <span>+44 330 088 8586</span>
          </a>

          {/* MOBILE CTA */}

          <button
            className="mobile-consultation-btn"
            onClick={handleConsultation}
          >
            Get Free Consultation
          </button>

        </nav>

        {/* =================================
            RIGHT ACTIONS
        ================================= */}

        <div className="navbar-actions">

          {/* DESKTOP CTA */}

          <button
            className="desktop-consultation-btn"
            onClick={handleConsultation}
          >
            Get Free Consultation
          </button>

          {/* LOGIN */}

          {!currentUser && (
            <button
              type="button"
              className="navbar-login"
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}

          {/* PROFILE */}

          {currentUser && (
            <div
              className="profile-wrapper"
              onMouseEnter={() => {
                if (!isMobile) {
                  setProfileOpen(true);
                }
              }}
              onMouseLeave={() => {
                if (!isMobile) {
                  setProfileOpen(false);
                }
              }}
            >

              <button
                type="button"
                className="profile-button"
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                aria-label="Open profile menu"
              >
                <FaUserCircle />
              </button>

              <div
                className={`profile-menu ${
                  profileOpen ? "show" : ""
                }`}
              >

                <NavLink
                  to={dashboardPath}
                  className="profile-menu-item"
                  onClick={closeAllMenus}
                >
                  <FaUser />
                  <span>Dashboard</span>
                </NavLink>

                <div className="profile-divider" />

                <button
                  type="button"
                  className="profile-menu-item logout"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>

              </div>

            </div>
          )}

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            className="navbar-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
          >
            {menuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

        </div>

      </div>
    </header>
  );
};

export default Navbar;