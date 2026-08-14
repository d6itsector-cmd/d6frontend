import { useEffect, useState } from "react";
import "./Settings.css";

import {
  FaUserCircle,
  FaBell,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";

import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const Settings = () => {
  const { currentUser, resetPassword } = useAuth();
  const [profile, setProfile] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState(""); // "" | "sending" | "sent" | "error"
  // "password" is a separate menu entry but shares the "security" panel --
  // that's where Change Password actually lives, there's no reason to split
  // it into its own empty section.
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setProfile(res.data?.data || null))
      .catch(() => setProfile(null));
  }, []);

  const handleChangePassword = async () => {
    if (!currentUser?.email) return;
    setPasswordStatus("sending");
    try {
      await resetPassword(currentUser.email);
      setPasswordStatus("sent");
    } catch {
      setPasswordStatus("error");
    }
  };

  return (
    <div className="settings">

      {/* Header */}

      <div className="settings-header">

        <div>

          <h1>Settings</h1>

          <p>
            Manage your account preferences and security.
          </p>

        </div>

      </div>

      {/* Settings Grid */}

      <div className="settings-grid">

        {/* LEFT */}

        <div className="settings-menu">

          <div
            className={`menu-item ${activeSection === "profile" ? "active" : ""}`}
            onClick={() => setActiveSection("profile")}
          >
            <FaUserCircle />
            Profile
          </div>

          <div
            className={`menu-item ${activeSection === "notifications" ? "active" : ""}`}
            onClick={() => setActiveSection("notifications")}
          >
            <FaBell />
            Notifications
          </div>

          <div
            className={`menu-item ${activeSection === "security" ? "active" : ""}`}
            onClick={() => setActiveSection("security")}
          >
            <FaLock />
            Password
          </div>

          <div
            className={`menu-item ${activeSection === "security" ? "active" : ""}`}
            onClick={() => setActiveSection("security")}
          >
            <FaShieldAlt />
            Security
          </div>

        </div>

        {/* RIGHT */}

        <div className="settings-content">

          {activeSection === "profile" && (
            <>

              <h2>Profile Information</h2>

              <div className="form-grid">

                <div className="input-group">

                  <label>Full Name</label>

                  <input
                    type="text"
                    value={currentUser?.displayName || "Not set"}
                    readOnly
                  />

                </div>

                <div className="input-group">

                  <label>Email</label>

                  <input
                    type="email"
                    value={currentUser?.email || ""}
                    readOnly
                  />

                </div>

                <div className="input-group">

                  <label>Company</label>

                  <input
                    type="text"
                    value={profile?.profile?.companyName || "Not set"}
                    readOnly
                  />

                </div>

                <div className="input-group">

                  <label>Phone</label>

                  <input
                    type="text"
                    value={profile?.profile?.phone || "Not set"}
                    readOnly
                  />

                </div>

              </div>

              <p className="settings-note">
                Profile details are managed by your account team. Contact support if any of this needs updating.
              </p>

            </>
          )}

          {activeSection === "notifications" && (
            <>

              <h2>Notification Preferences</h2>

              <div className="setting-row">

                <div>
                  <h4>Email Notifications</h4>
                  <p>Receive project updates by email.</p>
                </div>

                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>

              </div>

              <div className="setting-row">

                <div>
                  <h4>SMS Notifications</h4>
                  <p>Receive important alerts via SMS.</p>
                </div>

                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>

              </div>

              <div className="setting-row">

                <div>
                  <h4>Marketing Emails</h4>
                  <p>Receive offers and company updates.</p>
                </div>

                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>

              </div>

            </>
          )}

          {activeSection === "security" && (
            <>

              <h2>Security</h2>

              <div className="setting-row">

                <div>
                  <h4>Change Password</h4>
                  <p>
                    {passwordStatus === "sent"
                      ? `A password reset link has been sent to ${currentUser?.email}.`
                      : passwordStatus === "error"
                      ? "Something went wrong. Please try again."
                      : "We'll email you a secure link to reset your password."}
                  </p>
                </div>

                <button
                  className="outline-btn"
                  onClick={handleChangePassword}
                  disabled={passwordStatus === "sending" || passwordStatus === "sent"}
                >

                  {passwordStatus === "sending" ? "Sending..." : passwordStatus === "sent" ? "Sent" : "Change"}

                </button>

              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default Settings;