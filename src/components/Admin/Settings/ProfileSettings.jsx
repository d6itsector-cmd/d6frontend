import "./ProfileSettings.css";

const ProfileSettings = () => {
  return (
    <div className="settings-card">

      <h2>Admin Profile</h2>

      <div className="settings-grid">

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="admin@d6globalmedia.com"
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            placeholder="+44 7700 900000"
          />
        </div>

        <div className="form-group">
          <label>Profile Image</label>
          <input type="file" />
        </div>

      </div>

      <button className="save-btn">
        Save Profile
      </button>

    </div>
  );
};

export default ProfileSettings;