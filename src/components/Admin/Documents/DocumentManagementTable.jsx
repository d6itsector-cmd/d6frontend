import { useEffect, useState } from "react";
import "./DocumentManagementTable.css";
import api from "../../../services/api";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

const emptyForm = { client: "", project: "", name: "", description: "", category: "" };

// No file storage provider is configured for this deployment (see Phase 11 --
// AWS/S3 removed, no replacement introduced). This is a metadata-only record
// of a document a client should know about; there is no upload or download
// capability until a real storage provider is added.
const DocumentManagementTable = () => {
  const [documents, setDocuments] = useState([]);
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
      .get("/admin/documents", { params: { limit: 10 } })
      .then((res) => {
        setDocuments(res.data?.data || []);
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
    if (!form.client || !form.name) {
      setFormError("Client and name are required.");
      return;
    }
    setSaving(true);
    setFormError("");

    try {
      await api.post("/admin/documents", {
        client: form.client,
        project: form.project || undefined,
        name: form.name,
        description: form.description || undefined,
        category: form.category || undefined,
      });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Unable to save document.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete document "${doc.name}"?`)) return;
    try {
      await api.delete(`/admin/documents/${doc._id}`);
      setDocuments((prev) => prev.filter((d) => d._id !== doc._id));
    } catch {
      window.alert("Unable to delete this document.");
    }
  };

  return (
    <div className="doc-mgmt-card">

      <div className="doc-mgmt-header">
        <div>
          <h2>Document Management</h2>
          <p>Document records visible to clients through the client portal. File storage is not currently available.</p>
        </div>

        <button
          className="doc-mgmt-upload-btn"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "+ Add Document"}
        </button>
      </div>

      {showForm && (
        <form
          className="doc-mgmt-form"
          onSubmit={handleCreate}
        >
          {formError && <p className="doc-mgmt-form-error">{formError}</p>}

          <div className="doc-mgmt-form-grid">

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
              name="category"
              placeholder="Category (e.g. contract)"
              value={form.category}
              onChange={handleFieldChange}
            />

            <input
              type="text"
              name="name"
              placeholder="Document name"
              value={form.name}
              onChange={handleFieldChange}
              className="doc-mgmt-full-width"
              required
            />

            <input
              type="text"
              name="description"
              placeholder="Description (optional)"
              value={form.description}
              onChange={handleFieldChange}
              className="doc-mgmt-full-width"
            />

          </div>

          <button
            type="submit"
            className="doc-mgmt-submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      {status === "loading" && <p className="doc-mgmt-status">Loading documents...</p>}
      {status === "error" && <p className="doc-mgmt-status">We couldn't load documents right now.</p>}
      {status === "success" && documents.length === 0 && (
        <p className="doc-mgmt-status">No documents have been added yet.</p>
      )}

      {status === "success" && documents.length > 0 && (
        <table className="doc-mgmt-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Client</th>
              <th>Category</th>
              <th>Added</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.client?.displayName || d.client?.email || "-"}</td>
                <td>{d.category || "-"}</td>
                <td>{formatDate(d.createdAt)}</td>
                <td>
                  <button
                    className="doc-mgmt-delete"
                    onClick={() => handleDelete(d)}
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

export default DocumentManagementTable;
