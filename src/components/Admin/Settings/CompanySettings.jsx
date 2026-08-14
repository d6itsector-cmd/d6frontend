import "./CompanySettings.css";

const CompanySettings = () => {
  return (
    <div className="settings-card">

      <h2>Company Information</h2>

      <div className="settings-grid">

        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            placeholder="D6 Global Media"
          />
        </div>

        <div className="form-group">
          <label>Website</label>
          <input
            type="text"
            placeholder="https://d6globalmedia.com"
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
          <label>Email</label>
          <input
            type="email"
            placeholder="notifications@d6globalmedia.com"
          />
        </div>

        <div className="form-group">
          <label>Company Logo</label>
          <input type="file" />
        </div>

      </div>

      <button className="save-btn">
        Save Company
      </button>

    </div>
  );
};

export default CompanySettings;