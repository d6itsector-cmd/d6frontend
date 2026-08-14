import "./SecuritySettings.css";

const SecuritySettings = () => {
  return (
    <div className="settings-card">

      <h2>Change Password</h2>

      <div className="settings-grid">

        <div className="form-group">
          <label>Current Password</label>
          <input type="password" />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input type="password" />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" />
        </div>

      </div>

      <button className="save-btn">
        Update Password
      </button>

    </div>
  );
};

export default SecuritySettings;