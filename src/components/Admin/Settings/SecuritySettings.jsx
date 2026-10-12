import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

import "./SecuritySettings.css";

// Password input with its own show/hide toggle. Lucide Eye / EyeOff icons
// via react-icons/lu (lucide-react itself isn't a dependency of this app).
const PasswordField = ({ id, label }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>

      <div className="password-field">
        <input id={id} type={visible ? "text" : "password"} />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          aria-pressed={visible}
          aria-controls={id}
        >
          {visible ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  return (
    <div className="settings-card">

      <h2>Change Password</h2>

      <div className="settings-grid">

        <PasswordField id="current-password" label="Current Password" />

        <PasswordField id="new-password" label="New Password" />

        <PasswordField id="confirm-password" label="Confirm Password" />

      </div>

      <button className="save-btn">
        Update Password
      </button>

    </div>
  );
};

export default SecuritySettings;
