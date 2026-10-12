import "./ThemeSettings.css";

import ThemeChoice from "../../../theme/ThemeChoice";

// Site-wide theme for this device (public site, admin and client portal).
const ThemeSettings = () => {
  return (
    <div className="settings-card">

      <h2>Theme</h2>

      <ThemeChoice name="admin-theme" />

    </div>
  );
};

export default ThemeSettings;
