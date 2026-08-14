import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";

import {
  FaSearch,
  FaBell,
  FaChevronDown,
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Topbar = ({ onMenuClick, showGreeting = true }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState("idle"); // idle | loading | success | error
  const [searchOpen, setSearchOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const loadNotifications = () => {
    api
      .get("/notifications", { params: { limit: 10 } })
      .then((res) => {
        setNotifications(res.data?.data || []);
        setUnreadCount(res.data?.unreadCount ?? 0);
      })
      .catch(() => {
        // Leave whatever was last successfully loaded.
      });
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Debounced (300ms) live search, minimum 2 characters. Authenticated
  // clients automatically get the client-tier endpoint (their own projects/
  // documents/reports/messages/support alongside public content) since
  // api.js's interceptor already attaches the Firebase token whenever one
  // exists -- no separate "logged in" search call needed.
  useEffect(() => {
    const trimmed = searchQuery.trim();

    if (trimmed.length < 2) {
      setSearchResults([]);
      setSearchStatus("idle");
      return;
    }

    setSearchStatus("loading");

    const timer = setTimeout(() => {
      api
        .get("/search", { params: { query: trimmed, limit: 8 } })
        .then((res) => {
          setSearchResults(res.data?.results || []);
          setSearchStatus("success");
        })
        .catch(() => setSearchStatus("error"));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (result) => {
    if (!result.url) return;
    navigate(result.url);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    try {
      await logout();
    } finally {
      navigate("/");
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Non-critical -- leave state as-is on failure.
    }
  };

  return (
    <header className="topbar">

      <div className="topbar-left">

        <button
          className="dashboard-menu-toggle"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <FaBars />
        </button>

        <div>
          {/* The dashboard home page already leads with its own "Welcome
              Back" hero card right below this bar -- showing the same
              greeting here too just duplicates it. Every other page has no
              hero of its own, so it keeps the greeting. */}
          {showGreeting && <h1>Welcome Back, {currentUser?.displayName || "there"}</h1>}

          <p>{today}</p>
        </div>

      </div>

      <div className="topbar-right">

        {/* Search */}

        <div className="search-wrapper">

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Search projects, documents, reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            />

          </div>

          {searchOpen && searchQuery.trim().length >= 2 && (
            <div className="search-dropdown">

              {searchStatus === "loading" && <p className="search-empty">Searching...</p>}

              {searchStatus === "error" && (
                <p className="search-empty">Something went wrong. Please try again.</p>
              )}

              {searchStatus === "success" && searchResults.length === 0 && (
                <p className="search-empty">No results for "{searchQuery.trim()}".</p>
              )}

              {searchStatus === "success" && searchResults.length > 0 && (
                <div className="search-results-list">

                  {searchResults.map((r) => (
                    <div
                      key={`${r.type}-${r.id}`}
                      className={`search-result-item ${r.url ? "" : "no-link"}`}
                      onMouseDown={() => handleResultClick(r)}
                    >
                      <span className="search-result-type">{r.type}</span>

                      <div>
                        <strong>{r.title}</strong>
                        {r.description && <p>{r.description}</p>}
                      </div>
                    </div>
                  ))}

                </div>
              )}

            </div>
          )}

        </div>

        {/* Icons */}

        <div className="notif-wrapper">

          <button
            className="icon-btn"
            onClick={() => setOpen((o) => !o)}
            aria-label="Notifications"
            aria-expanded={open}
          >

            <FaBell />

            {unreadCount > 0 && <span>{unreadCount}</span>}

          </button>

          {open && (
            <div className="notif-dropdown">

              <div className="notif-dropdown-header">Notifications</div>

              <div className="notif-list">

                {notifications.length === 0 && (
                  <p className="notif-empty">You're all caught up.</p>
                )}

                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`notif-list-item ${n.read ? "" : "unread"}`}
                    onClick={() => {
                      if (!n.read) handleMarkRead(n._id);
                      if (n.link) navigate(n.link);
                      setOpen(false);
                    }}
                  >
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                  </div>
                ))}

              </div>

            </div>
          )}

        </div>

        {/* User */}

        <div className="profile-wrapper">

          <button
            type="button"
            className="profile-box"
            onClick={() => setProfileOpen((o) => !o)}
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >

            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" />
            ) : (
              <FaUserCircle className="profile-avatar-icon" />
            )}

            <h4>{currentUser?.displayName || "Guest"}</h4>

            <FaChevronDown className={profileOpen ? "rotate" : ""} />

          </button>

          {profileOpen && (
            <div className="profile-dropdown">

              <button
                type="button"
                className="profile-dropdown-item logout"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default Topbar;
