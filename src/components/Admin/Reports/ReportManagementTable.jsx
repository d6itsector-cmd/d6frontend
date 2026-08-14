import { useEffect, useState } from "react";
import "./ReportManagementTable.css";
import api from "../../../services/api";

const REPORT_TYPES = ["monthly", "weekly", "campaign", "seo", "social-media", "performance", "other"];

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

const emptyForm = {
  client: "", project: "", title: "", description: "", reportType: "monthly",
  periodStart: "", periodEnd: "",
};

// No file storage provider is configured for this deployment (see Phase 11 --
// AWS/S3 removed, no replacement introduced). This is a metadata-only record
// of a report a client should know about; there is no upload or download
// capability until a real storage provider is added.
const ReportManagementTable = () => {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("loading");

  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = () => {
    setStatus("loading");
    api
      .get("/admin/reports", { params: { limit: 10 } })
      .then((res) => {
        setReports(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, []);

  useEffect(() => {
    if (!showForm) return;
    api
      .get("/admin/users", { params: { role: "client", status: "active", limit: 100 } })
      .then((res) => setClients(res.data?.data || []))
      .catch(() => setClients([]));
  }, [showForm]);

  useEffect(() => {
    if (!form.client) {
      setProjects([]);
      return;
    }
    api
      .get("/admin/projects", { params: { client: form.client, limit: 100 } })
      .then((res) => setProjects(res.data?.data || []))
      .catch(() => setProjects([]));
  }, [form.client]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value, ...(name === "client" ? { project: "" } : {}) }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.client || !form.title) {
      setFormError("Client and title are required.");
      return;
    }
    setSaving(true);
    setFormError("");

    try {
      await api.post("/admin/reports", {
        client: form.client,
        project: form.project || undefined,
        title: form.title,
        description: form.description || undefined,
        reportType: form.reportType,
        periodStart: form.periodStart || undefined,
        periodEnd: form.periodEnd || undefined,
      });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Unable to save report.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (report) => {
    if (!window.confirm(`Delete report "${report.title}"?`)) return;
    try {
      await api.delete(`/admin/reports/${report._id}`);
      setReports((prev) => prev.filter((r) => r._id !== report._id));
    } catch {
      window.alert("Unable to delete this report.");
    }
  };

  return (
    <div className="report-mgmt-card">

      <div className="report-mgmt-header">
        <div>
          <h2>Report Management</h2>
          <p>Report records visible to clients through the client portal. File storage is not currently available.</p>
        </div>

        <button
          className="report-mgmt-upload-btn"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "+ Add Report"}
        </button>
      </div>

      {showForm && (
        <form
          className="report-mgmt-form"
          onSubmit={handleCreate}
        >
          {formError && <p className="report-mgmt-form-error">{formError}</p>}

          <div className="report-mgmt-form-grid">

            <select
              name="client"
              value={form.client}
              onChange={handleFieldChange}
              required
            >
              <option value="">Select Client</option>
              {clients.map((c) => (
                <option
                  key={c._id}
                  value={c._id}
                >
                  {c.displayName || c.email}
                </option>
              ))}
            </select>

            <select
              name="project"
              value={form.project}
              onChange={handleFieldChange}
              disabled={!form.client}
            >
              <option value="">No specific project</option>
              {projects.map((p) => (
                <option
                  key={p._id}
                  value={p._id}
                >
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="title"
              placeholder="Report Title"
              value={form.title}
              onChange={handleFieldChange}
              required
            />

            <select
              name="reportType"
              value={form.reportType}
              onChange={handleFieldChange}
            >
              {REPORT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <input
              type="date"
              name="periodStart"
              value={form.periodStart}
              onChange={handleFieldChange}
            />

            <input
              type="date"
              name="periodEnd"
              value={form.periodEnd}
              onChange={handleFieldChange}
            />

            <input
              type="text"
              name="description"
              placeholder="Description (optional)"
              value={form.description}
              onChange={handleFieldChange}
              className="report-mgmt-full-width"
            />

          </div>

          <button
            type="submit"
            className="report-mgmt-submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      {status === "loading" && <p className="report-mgmt-status">Loading reports...</p>}
      {status === "error" && <p className="report-mgmt-status">We couldn't load reports right now.</p>}
      {status === "success" && reports.length === 0 && (
        <p className="report-mgmt-status">No reports have been created yet.</p>
      )}

      {status === "success" && reports.length > 0 && (
        <table className="report-mgmt-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Client</th>
              <th>Type</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td>{r.title}</td>
                <td>{r.client?.displayName || r.client?.email || "-"}</td>
                <td>{r.reportType}</td>
                <td>{formatDate(r.createdAt)}</td>
                <td>
                  <button
                    className="report-mgmt-delete"
                    onClick={() => handleDelete(r)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default ReportManagementTable;
