import "./Settings-admin.css";

import ProfileSettings from "../../../components/Admin/Settings/ProfileSettings";
import CompanySettings from "../../../components/Admin/Settings/CompanySettings";
import SecuritySettings from "../../../components/Admin/Settings/SecuritySettings";
import SocialSettings from "../../../components/Admin/Settings/SocialSettings";
import NotificationSettings from "../../../components/Admin/Settings/NotificationSettings";
import ThemeSettings from "../../../components/Admin/Settings/ThemeSettings";

const SettingsAdmin = () => {
  return (
    <div className="settings-page">

      <div className="settings-header">

        <h1>Settings</h1>

        <p>
          Manage your account and website settings.
        </p>

      </div>

      <ProfileSettings />

      <CompanySettings />

      <SecuritySettings />

      <SocialSettings />

      <NotificationSettings />

      <ThemeSettings />

    </div>
  );
};

export default SettingsAdmin;