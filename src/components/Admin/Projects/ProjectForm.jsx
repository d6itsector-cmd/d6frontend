import { useEffect, useState } from "react";
import "./ProjectForm.css";
import api from "../../../services/api";

const SERVICES = [
  "SEO",
  "Google Ads",
  "Social Media Marketing",
  "Website Development",
  "Email Marketing",
  "Branding",
  "Complete Digital Marketing",
];

const STATUSES = ["planning", "active", "on-hold", "completed", "cancelled"];
const PRIORITIES = ["low", "medium", "high"];

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

// project (optional) present => edit mode; absent => create mode.
const ProjectForm = ({ project, onClose, onSaved }) => {
  const [clients, setClients] = useState([]);
  const [clientsStatus, setClientsStatus] = useState("loading");

  const [formData, setFormData] = useState({
    client: project?.client?._id || project?.client || "",
    name: project?.name || "",
    description: project?.description || "",
    service: project?.service || "",
    status: project?.status || "planning",
    progress: project?.progress ?? 0,
    priority: project?.priority || "medium",
    startDate: toDateInput(project?.startDate),
    dueDate: toDateInput(project?.dueDate),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // The client selector loads only real, active clients -- an admin can
  // never type in an arbitrary client ID by hand.
  useEffect(() => {
    api
      .get("/admin/users", { params: { role: "client", status: "active", limit: 100 } })
      .then((res) => {
        setClients(res.data?.data || []);
        setClientsStatus("success");
      })
      .catch(() => setClientsStatus("error"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      client: formData.client,
      name: formData.name,
      description: formData.description || undefined,
      service: formData.service || undefined,
      status: formData.status,
      progress: Number(formData.progress),
      priority: formData.priority,
      startDate: formData.startDate || undefined,
      dueDate: formData.dueDate || undefined,
    };

    try {
      const res = project
        ? await api.put(`/admin/projects/${project._id}`, payload)
        : await api.post("/admin/projects", payload);
      onSaved(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="project-modal">
      <div className="project-form-card">

        <div className="project-header">
          <h2>{project ? "Edit Project" : "Add New Project"}</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit}>

          <div className="project-grid">

            <div className="form-group">
              <label>Project Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Project Name"
                required
              />
            </div>

            <div className="form-group">
              <label>Client</label>

              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
                disabled={clientsStatus !== "success"}
              >
                <option value="">
                  {clientsStatus === "loading" ? "Loading clients..." : "Select Client"}
                </option>
                {clients.map((c) => (
                  <option
                    key={c._id}
                    value={c._id}
                  >
                    {c.displayName || c.email}
                  </option>
                ))}
              </select>

              {clientsStatus === "error" && (
                <span className="field-hint">Couldn't load clients. Try reopening this form.</span>
              )}
            </div>

            <div className="form-group">
              <label>Service</label>

              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option value="">Select Service</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Start Date</label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Due Date</label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Progress (%)</label>

              <input
                type="number"
                name="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>

              <textarea
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Project Description..."
              />
            </div>

          </div>

          <div className="project-buttons">

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
              disabled={saving || !formData.client}
            >
              {saving ? "Saving..." : "Save Project"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default ProjectForm;
