import "./SocialSettings.css";

const SocialSettings = () => {
  return (
    <div className="settings-card">

      <h2>Social Media Links</h2>

      <div className="settings-grid">

        <div className="form-group">
          <label>Facebook</label>
          <input type="text" />
        </div>

        <div className="form-group">
          <label>Instagram</label>
          <input type="text" />
        </div>

        <div className="form-group">
          <label>LinkedIn</label>
          <input type="text" />
        </div>

        <div className="form-group">
          <label>YouTube</label>
          <input type="text" />
        </div>

      </div>

      <button className="save-btn">
        Save Links
      </button>

    </div>
  );
};

export default SocialSettings;