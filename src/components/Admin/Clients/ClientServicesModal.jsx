import { useEffect, useState } from "react";
import "./ClientServicesModal.css";
import api from "../../../services/api";

const STATUS_OPTIONS = ["pending", "active", "on-hold", "completed", "cancelled"];

const STATUS_LABELS = {
  pending: "Pending",
  active: "Active",
  "on-hold": "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

const emptyForm = {
  service: "",
  status: "pending",
  progress: 0,
  startDate: "",
  targetDate: "",
  description: "",
  requirements: "",
  clientActionRequired: "",
  adminNotes: "",
};

// Admin-only surface for the ClientService relationship (Phase 14): a
// client's assigned services, opened from the Clients table. Reuses the
// existing published Service catalog for the picker -- never a second
// catalog -- and the existing client/admin modal visual language.
const ClientServicesModal = ({ client, onClose }) => {
  const [assignments, setAssignments] = useState([]);
  const [status, setStatus] = useState("loading");

  const [catalog, setCatalog] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = () => {
    setStatus("loading");
    api
      .get("/admin/client-services", { params: { client: client._id, limit: 50 } })
      .then((res) => {
        setAssignments(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, [client._id]);

  useEffect(() => {
    if (!showForm) return;
    api
      .get("/admin/services", { params: { status: "published", limit: 100 } })
      .then((res) => setCatalog(res.data?.data || []))
      .catch(() => setCatalog([]));
  }, [showForm]);

  const openAssignForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (assignment) => {
    setEditingId(assignment._id);
    setForm({
      service: assignment.service?._id || "",
      status: assignment.status,
      progress: assignment.progress ?? 0,
      startDate: toDateInput(assignment.startDate),
      targetDate: toDateInput(assignment.targetDate),
      description: assignment.description || "",
      requirements: assignment.requirements || "",
      clientActionRequired: assignment.clientActionRequired || "",
      adminNotes: assignment.adminNotes || "",
    });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !form.service) {
      setFormError("Please select a service.");
      return;
    }
    setSaving(true);
    setFormError("");

    try {
      if (editingId) {
        await api.put(`/admin/client-services/${editingId}`, {
          status: form.status,
          progress: Number(form.progress) || 0,
          startDate: form.startDate || undefined,
          targetDate: form.targetDate || undefined,
          description: form.description || undefined,
          requirements: form.requirements || undefined,
          clientActionRequired: form.clientActionRequired || undefined,
          adminNotes: form.adminNotes || undefined,
        });
      } else {
        await api.post("/admin/client-services", {
          client: client._id,
          service: form.service,
          status: form.status,
          progress: Number(form.progress) || 0,
          startDate: form.startDate || undefined,
          targetDate: form.targetDate || undefined,
          description: form.description || undefined,
          requirements: form.requirements || undefined,
          clientActionRequired: form.clientActionRequired || undefined,
          adminNotes: form.adminNotes || undefined,
        });
      }
      closeForm();
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Unable to save this service assignment.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (assignment) => {
    if (
      !window.confirm(
        `Remove ${assignment.service?.title || "this service"} from ${client.displayName || client.email}?`
      )
    )
      return;

    try {
      await api.delete(`/admin/client-services/${assignment._id}`);
      setAssignments((prev) => prev.filter((a) => a._id !== assignment._id));
    } catch (err) {
      window.alert(err.response?.data?.message || "Unable to remove this service assignment.");
    }
  };

  return (
    <div className="csvc-modal" onClick={onClose}>
      <div className="csvc-card" onClick={(e) => e.stopPropagation()}>
        <div className="csvc-header">
          <div>
            <h2>{client.displayName || client.email}</h2>
            <p>{client.profile?.companyName || client.email}</p>
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="csvc-section-header">
          <h3>Assigned Services</h3>

          {!showForm && (
            <button className="csvc-assign-btn" onClick={openAssignForm}>
              + Assign Service
            </button>
          )}
        </div>

        {showForm && (
          <form className="csvc-form" onSubmit={handleSubmit}>
            {formError && <p className="form-error">{formError}</p>}

            <div className="csvc-form-grid">
              <div className="form-group">
                <label>Service</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleFieldChange}
                  disabled={!!editingId}
                  required
                >
                  <option value="">Select a service</option>
                  {catalog.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleFieldChange}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
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
                  value={form.progress}
                  onChange={handleFieldChange}
                  disabled={form.status === "completed"}
                />
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input type="date" name="startDate" value={form.startDate} onChange={handleFieldChange} />
              </div>

              <div className="form-group">
                <label>Target Date</label>
                <input type="date" name="targetDate" value={form.targetDate} onChange={handleFieldChange} />
              </div>

              <div className="form-group full-width">
                <label>Description (visible to client)</label>
                <textarea
                  name="description"
                  rows="2"
                  placeholder="What this engagement covers for this client"
                  value={form.description}
                  onChange={handleFieldChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Requirements (visible to client)</label>
                <textarea
                  name="requirements"
                  rows="2"
                  placeholder="What we need from the client to deliver this"
                  value={form.requirements}
                  onChange={handleFieldChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Client Action Required (visible to client)</label>
                <textarea
                  name="clientActionRequired"
                  rows="2"
                  placeholder="Leave blank if nothing is currently needed from the client"
                  value={form.clientActionRequired}
                  onChange={handleFieldChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Admin Notes (internal only)</label>
                <textarea
                  name="adminNotes"
                  rows="2"
                  placeholder="Never shown to the client"
                  value={form.adminNotes}
                  onChange={handleFieldChange}
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="button" className="cancel-btn" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save Changes" : "Assign Service"}
              </button>
            </div>
          </form>
        )}

        {status === "loading" && <p className="csvc-status">Loading services...</p>}
        {status === "error" && <p className="csvc-status">We couldn't load this client's services.</p>}
        {status === "success" && assignments.length === 0 && !showForm && (
          <p className="csvc-status">No services have been assigned to this client yet.</p>
        )}

        {status === "success" && assignments.length > 0 && (
          <div className="csvc-list">
            {assignments.map((a) => (
              <div className="csvc-row" key={a._id}>
                <div className="csvc-row-main">
                  <strong>{a.service?.title || "Service"}</strong>
                  <span className={`csvc-badge csvc-${a.status}`}>{STATUS_LABELS[a.status] || a.status}</span>
                </div>

                <div className="csvc-progress-row">
                  <div className="csvc-progress-bar">
                    <div className="csvc-progress-fill" style={{ width: `${a.progress ?? 0}%` }}></div>
                  </div>
                  <span>{a.progress ?? 0}%</span>
                </div>

                <div className="csvc-row-meta">
                  <span>Start: {formatDate(a.startDate)}</span>
                  <span>Target: {formatDate(a.targetDate)}</span>
                </div>

                {a.clientActionRequired && (
                  <p className="csvc-action-required">Action required: {a.clientActionRequired}</p>
                )}

                <div className="csvc-row-actions">
                  <button className="edit-btn" onClick={() => openEditForm(a)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(a)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientServicesModal;
