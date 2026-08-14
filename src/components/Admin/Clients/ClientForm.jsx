import { useState } from "react";
import "./ClientForm.css";
import api from "../../../services/api";

// Edits an existing client account only -- there is no "create client" flow.
// New accounts are always created by Firebase registration + server-side
// sync, never manually by an admin.
const ClientForm = ({ user, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    displayName: user.displayName || "",
    companyName: user.profile?.companyName || "",
    phone: user.profile?.phone || "",
    status: user.status,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await api.put(`/admin/users/${user._id}`, {
        displayName: formData.displayName,
        status: formData.status,
        profile: { companyName: formData.companyName, phone: formData.phone },
      });
      onSaved(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="client-modal">

      <div className="client-form-card">

        <div className="client-form-header">
          <h2>Edit Client</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Client Name</label>

              <input
                type="text"
                name="displayName"
                placeholder="Enter client name"
                value={formData.displayName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Company Name</label>

              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                value={user.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                placeholder="+44 7700 900000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

          </div>

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ClientForm;
