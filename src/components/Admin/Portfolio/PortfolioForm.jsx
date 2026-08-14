import { useState } from "react";
import "./PortfolioForm.css";
import api from "../../../services/api";

// item (optional) present => edit mode; absent => create mode.
const PortfolioForm = ({ item, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: item?.title || "",
    clientName: item?.clientName || "",
    industry: item?.industry || "",
    services: (item?.services || []).join(", "),
    projectUrl: item?.projectUrl || "",
    shortDescription: item?.shortDescription || "",
    description: item?.description || "",
    image: item?.image || "",
    status: item?.status || "draft",
    featured: item?.featured || false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      clientName: form.clientName || undefined,
      industry: form.industry || undefined,
      services: form.services
        ? form.services.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined,
      projectUrl: form.projectUrl || undefined,
      shortDescription: form.shortDescription || undefined,
      description: form.description || undefined,
      image: form.image || undefined,
      status: form.status,
      featured: form.featured,
    };

    try {
      const res = item
        ? await api.put(`/admin/portfolio/${item._id}`, payload)
        : await api.post("/admin/portfolio", payload);
      onSaved(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save this portfolio item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="portfolio-modal">

      <div className="portfolio-form">

        <div className="form-header">
          <h2>{item ? "Edit Portfolio Item" : "Add Portfolio"}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <p className="form-error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Project Title</label>
              <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Client Name</label>
              <input
                type="text"
                name="clientName"
                placeholder="Client Name"
                value={form.clientName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Industry</label>
              <input
                type="text"
                name="industry"
                placeholder="e.g. Retail, Hospitality"
                value={form.industry}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Services (comma-separated)</label>
              <input
                type="text"
                name="services"
                placeholder="SEO, Website Development"
                value={form.services}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full">
              <label>Project URL</label>
              <input
                type="url"
                name="projectUrl"
                placeholder="https://example.com"
                value={form.projectUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full">
              <label>Short Description</label>
              <input
                type="text"
                name="shortDescription"
                placeholder="One-line summary shown on the card"
                value={form.shortDescription}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full">
              <label>Description</label>
              <textarea
                rows="5"
                name="description"
                placeholder="Project Description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full">
              <label>Image URL</label>
              <input
                type="url"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                id="portfolio-featured"
              />
              <label htmlFor="portfolio-featured">Featured Project</label>
            </div>

          </div>

          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Project"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default PortfolioForm;
