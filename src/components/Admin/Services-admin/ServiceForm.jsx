import { useState } from "react";
import "./ServiceForm.css";
import api from "../../../services/api";

// service (optional) present => edit mode; absent => create mode.
const ServiceForm = ({ service, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: service?.title || "",
    shortDescription: service?.shortDescription || "",
    description: service?.description || "",
    icon: service?.icon || "",
    image: service?.image || "",
    features: (service?.features || []).join(", "),
    status: service?.status || "draft",
    sortOrder: service?.sortOrder ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      shortDescription: form.shortDescription || undefined,
      description: form.description || undefined,
      icon: form.icon || undefined,
      image: form.image || undefined,
      features: form.features
        ? form.features.split(",").map((f) => f.trim()).filter(Boolean)
        : undefined,
      status: form.status,
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      const res = service
        ? await api.put(`/admin/services/${service._id}`, payload)
        : await api.post("/admin/services", payload);
      onSaved(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save service.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="service-modal">

      <div className="service-form">

        <div className="form-header">
          <h2>{service ? "Edit Service" : "Add New Service"}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <p className="form-error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Service Name</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Search Engine Optimisation"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Icon (react-icons name, optional)</label>
              <input
                type="text"
                name="icon"
                placeholder="FaSearch"
                value={form.icon}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full">
              <label>Short Description</label>
              <input
                type="text"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                placeholder="One-line summary shown on service cards"
              />
            </div>

            <div className="form-group full">
              <label>Description</label>
              <textarea
                rows="5"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Full service description"
              />
            </div>

            <div className="form-group full">
              <label>Key Features (comma-separated)</label>
              <input
                type="text"
                name="features"
                value={form.features}
                onChange={handleChange}
                placeholder="Keyword research, On-page SEO, Technical audits"
              />
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group">
              <label>Sort Order</label>
              <input
                type="number"
                name="sortOrder"
                min="0"
                value={form.sortOrder}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

          </div>

          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Service"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default ServiceForm;
