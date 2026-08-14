import "./NotificationSettings.css";

const NotificationSettings = () => {
  return (
    <div className="settings-card">

      <h2>Notifications</h2>

      <div className="toggle-group">

        <div className="toggle-row">
          <span>Email Notifications</span>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-row">
          <span>Lead Alerts</span>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-row">
          <span>Consultation Alerts</span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>

      </div>

    </div>
  );
};

export default NotificationSettings;