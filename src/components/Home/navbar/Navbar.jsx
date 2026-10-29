import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useConsultation } from "../../../context/ConsultationContext";
import { useLoginModal } from "../../../context/LoginModalContext";
import { useAuth } from "../../../context/AuthContext";
import { useUserRole } from "../../../hooks/useUserRole";
import { navbarConfig } from "../../../config/navbarConfig";

import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaUser,
  FaSignOutAlt,
  FaPhoneAlt,
} from "react-icons/fa";

import logo from "../../../assets/d6.png";
import "./Navbar.css";

// Widest viewport that gets the hamburger menu. Must match the
// `@media (max-width: 1279px)` block in Navbar.css.
const MOBILE_NAV_MAX = 1279;

const Navbar = () => {
  const { openConsultation } = useConsultation();
  const { openLogin } = useLoginModal();
  const { currentUser, logout } = useAuth();
  const { role } = useUserRole();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);

  /* =========================
     PROFILE MENU: CLOSE ON OUTSIDE CLICK / ESCAPE
  ========================= */

  useEffect(() => {
    if (!profileOpen) return;

    const handlePointerDown = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        profileButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  // Arrow keys move between the menu items (Dashboard / Logout).
  const handleProfileMenuKeyDown = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();

    const items = [...profileRef.current.querySelectorAll('[role="menuitem"]')];
    const index = items.indexOf(document.activeElement);
    const next =
      e.key === "ArrowDown"
        ? (index + 1) % items.length
        : (index - 1 + items.length) % items.length;

    items[next]?.focus();
  };

  /* =========================
     MOBILE RESPONSIVE
  ========================= */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MOBILE_NAV_MAX) {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =========================
     HELPERS
  ========================= */

  const closeAllMenus = () => {
    setMenuOpen(false);
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
            alt="D6 Global Services"
          />

          <span className="logo-text">
            D6 <span>Global Services</span>
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

          {/* SERVICES -- not `end`, so it stays active on /services/<name> */}

          <NavLink
            to="/services"
            className={({ isActive }) =>
              `navbar-link ${isActive ? "active" : ""}`
            }
            onClick={closeAllMenus}
          >
            Services
          </NavLink>

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

          {navbarConfig.showIndustries && (
            <NavLink
              to="/industries"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
              onClick={closeAllMenus}
            >
              Industries
            </NavLink>
          )}

          {navbarConfig.showPortfolio && (
            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
              onClick={closeAllMenus}
            >
              Portfolio
            </NavLink>
          )}

          {navbarConfig.showBlog && (
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
              onClick={closeAllMenus}
            >
              Blog
            </NavLink>
          )}

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

          {navbarConfig.showPhoneNumber && (
            <a
              href="tel:+447776635958"
              className="navbar-phone"
              aria-label="Call D6 Global Services"
            >
              <FaPhoneAlt />
              <span>+44 7776 635958</span>
            </a>
          )}

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
              ref={profileRef}
              onKeyDown={handleProfileMenuKeyDown}
            >

              <button
                type="button"
                ref={profileButtonRef}
                className={`profile-button ${profileOpen ? "active" : ""}`}
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                aria-label="Profile menu"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                aria-controls="navbar-profile-menu"
              >
                <FaUserCircle />
              </button>

              <div
                id="navbar-profile-menu"
                role="menu"
                aria-label="Profile"
                className={`profile-menu ${
                  profileOpen ? "show" : ""
                }`}
              >

                <NavLink
                  to={dashboardPath}
                  role="menuitem"
                  className="profile-menu-item"
                  onClick={closeAllMenus}
                >
                  <FaUser />
                  <span>Dashboard</span>
                </NavLink>

                <div className="profile-divider" role="separator" />

                <button
                  type="button"
                  role="menuitem"
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