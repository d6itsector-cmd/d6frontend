import { useEffect, useState } from "react";
import "./ProjectForm.css";
import "../../Billing/Billing.css";
import api from "../../../services/api";
import ClientSelect from "../Billing/ClientSelect";
import { RequiredMark, FieldError } from "../../Billing/FieldBits";
import { poundsToPence, penceToPoundsInput, MAX_AMOUNT_PENCE } from "../../../utils/billingFormat";

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

const SERVICE_STATUS_LABELS = {
  pending: "Pending",
  active: "Active",
  "on-hold": "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");
const idOf = (v) => (v && typeof v === "object" ? v._id : v);

// Client-side checks mirror the backend validator, so the admin gets a
// field-level message instead of the API's generic "Invalid request data".
const validate = (form, isCreate) => {
  const errors = {};
  if (!form.name.trim()) errors.name = "Enter a project name.";
  if (!form.client) errors.client = "Select the client this project is for.";
  if (isCreate && !form.description.trim()) errors.description = "Add a short description.";
  if (isCreate && !form.startDate) errors.startDate = "Choose a start date.";
  if (form.startDate && form.dueDate && form.dueDate < form.startDate) {
    errors.dueDate = "The due date can't be before the start date.";
  }
  if (form.budget.trim()) {
    const pence = poundsToPence(form.budget);
    if (pence === null) errors.budget = "Enter the budget in pounds, e.g. 4500 or 4500.50.";
    else if (pence > MAX_AMOUNT_PENCE) errors.budget = "That budget is too large.";
  }
  const progress = Number(form.progress);
  if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
    errors.progress = "Progress must be a whole number from 0 to 100.";
  }
  form.milestones.forEach((m, i) => {
    if (!m.title.trim()) errors[`milestone-${i}`] = "Give this milestone a title, or remove it.";
  });
  return errors;
};

// project (optional) present => edit mode; absent => create mode.
const ProjectForm = ({ project, onClose, onSaved }) => {
  const isCreate = !project;

  const [formData, setFormData] = useState({
    client: idOf(project?.client) || "",
    name: project?.name || "",
    description: project?.description || "",
    service: project?.service || "",
    status: project?.status || "planning",
    progress: project?.progress ?? 0,
    priority: project?.priority || "medium",
    startDate: toDateInput(project?.startDate),
    dueDate: toDateInput(project?.dueDate),
    budget: penceToPoundsInput(project?.budgetPence),
    linkedServices: (project?.linkedServices || []).map(idOf),
    milestones: [],
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // The selected client's own service assignments -- the only services a
  // project may link to (the backend enforces the same rule).
  const [assignments, setAssignments] = useState([]);
  const [assignmentsStatus, setAssignmentsStatus] = useState(project?.client ? "loading" : "idle");

  useEffect(() => {
    if (!formData.client) return undefined;
    let cancelled = false;
    api
      .get("/admin/client-services", { params: { client: formData.client, limit: 100 } })
      .then((res) => {
        if (cancelled) return;
        setAssignments(res.data?.data || []);
        setAssignmentsStatus("success");
      })
      .catch(() => {
        if (!cancelled) setAssignmentsStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [formData.client]);

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleChange = (e) => setField(e.target.name, e.target.value);

  // Links belong to one client, so choosing a different client clears them
  // and reloads that client's assignments.
  const handleClientChange = (id) => {
    setFormData((prev) => ({ ...prev, client: id, linkedServices: prev.client === id ? prev.linkedServices : [] }));
    setAssignments([]);
    setAssignmentsStatus(id ? "loading" : "idle");
    setErrors((prev) => ({ ...prev, client: undefined }));
  };

  const toggleLinkedService = (id) => {
    setFormData((prev) => ({
      ...prev,
      linkedServices: prev.linkedServices.includes(id)
        ? prev.linkedServices.filter((s) => s !== id)
        : [...prev.linkedServices, id],
    }));
  };

  const addMilestone = () =>
    setFormData((prev) => ({ ...prev, milestones: [...prev.milestones, { title: "", eventDate: "" }] }));

  const updateMilestone = (index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => (i === index ? { ...m, [key]: value } : m)),
    }));
    setErrors((prev) => ({ ...prev, [`milestone-${index}`]: undefined }));
  };

  const removeMilestone = (index) => {
    setFormData((prev) => ({ ...prev, milestones: prev.milestones.filter((_, i) => i !== index) }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => k.startsWith("milestone-") && delete next[k]);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(formData, isCreate);
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      setError("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      client: formData.client,
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      service: formData.service || undefined,
      status: formData.status,
      progress: Number(formData.progress),
      priority: formData.priority,
      startDate: formData.startDate || undefined,
      dueDate: formData.dueDate || undefined,
      budgetPence: formData.budget.trim() ? poundsToPence(formData.budget) : undefined,
      linkedServices: formData.linkedServices,
    };
    if (isCreate && formData.milestones.length) {
      payload.milestones = formData.milestones.map((m) => ({
        title: m.title.trim(),
        eventDate: m.eventDate || undefined,
      }));
    }

    try {
      const res = project
        ? await api.put(`/admin/projects/${project._id}`, payload)
        : await api.post("/admin/projects", payload);
      onSaved(res.data.data, isCreate ? "created" : "updated");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fieldProps = (name) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `pf-${name}-error` : undefined,
  });

  return (
    <div className="project-modal">
      <div className="project-form-card">

        <div className="project-header">
          <h2>{project ? "Edit Project" : "Add New Project"}</h2>

          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit} noValidate>

          <div className="project-grid">

            <div className="form-group">
              <label htmlFor="pf-name">Project Name <RequiredMark /></label>

              <input
                id="pf-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Project Name"
                maxLength={200}
                {...fieldProps("name")}
              />
              <FieldError id="pf-name-error" message={errors.name} />
            </div>

            <div className="form-group">
              <label htmlFor="pf-client">Client <RequiredMark /></label>

              <ClientSelect
                id="pf-client"
                value={formData.client}
                onChange={handleClientChange}
                activeOnly
                required
                showSelected
                invalid={!!errors.client}
                describedBy={errors.client ? "pf-client-error" : undefined}
              />
              <FieldError id="pf-client-error" message={errors.client} />
            </div>

            <div className="form-group">
              <label htmlFor="pf-service">Service Category</label>

              <select
                id="pf-service"
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
              <label htmlFor="pf-priority">Priority</label>

              <select
                id="pf-priority"
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
              <label htmlFor="pf-start">Start Date {isCreate && <RequiredMark />}</label>

              <input
                id="pf-start"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                {...fieldProps("startDate")}
              />
              <FieldError id="pf-startDate-error" message={errors.startDate} />
            </div>

            <div className="form-group">
              <label htmlFor="pf-due">Due Date</label>

              <input
                id="pf-due"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                min={formData.startDate || undefined}
                onChange={handleChange}
                {...fieldProps("dueDate")}
              />
              <FieldError id="pf-dueDate-error" message={errors.dueDate} />
            </div>

            <div className="form-group">
              <label htmlFor="pf-budget">Budget (£)</label>

              <input
                id="pf-budget"
                type="text"
                inputMode="decimal"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g. 4500.00"
                {...fieldProps("budget")}
              />
              <FieldError id="pf-budget-error" message={errors.budget} />
            </div>

            <div className="form-group">
              <label htmlFor="pf-status">Status</label>

              <select
                id="pf-status"
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
              <label htmlFor="pf-progress">Progress (%)</label>

              <input
                id="pf-progress"
                type="number"
                name="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleChange}
                {...fieldProps("progress")}
              />
              <FieldError id="pf-progress-error" message={errors.progress} />
            </div>

            <div className="form-group full-width">
              <label htmlFor="pf-description">Description {isCreate && <RequiredMark />}</label>

              <textarea
                id="pf-description"
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Project Description..."
                maxLength={2000}
                {...fieldProps("description")}
              />
              <FieldError id="pf-description-error" message={errors.description} />
            </div>

            <fieldset className="form-group full-width pf-fieldset">
              <legend>Linked Services</legend>

              {!formData.client && (
                <p className="field-hint">Select a client to see the services assigned to them.</p>
              )}
              {formData.client && assignmentsStatus === "loading" && (
                <p className="field-hint">Loading this client's services...</p>
              )}
              {formData.client && assignmentsStatus === "error" && (
                <p className="field-hint">Couldn't load this client's services. Try reopening this form.</p>
              )}
              {formData.client && assignmentsStatus === "success" && assignments.length === 0 && (
                <p className="field-hint">
                  This client has no assigned services yet. Assign one from Clients → Services first.
                </p>
              )}
              {formData.client && assignmentsStatus === "success" && assignments.length > 0 && (
                <div className="pf-checks">
                  {assignments.map((a) => (
                    <label key={a._id} className="pf-check">
                      <input
                        type="checkbox"
                        checked={formData.linkedServices.includes(a._id)}
                        onChange={() => toggleLinkedService(a._id)}
                      />
                      <span>
                        {a.service?.title || "Service"}
                        <small> · {SERVICE_STATUS_LABELS[a.status] || a.status}</small>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </fieldset>

            {isCreate && (
              <fieldset className="form-group full-width pf-fieldset">
                <legend>Milestones</legend>

                {formData.milestones.length === 0 && (
                  <p className="field-hint">Optional. Key dates the client will see on the project timeline.</p>
                )}

                {formData.milestones.map((m, i) => (
                  <div className="pf-milestone" key={i}>
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) => updateMilestone(i, "title", e.target.value)}
                      placeholder="Milestone title"
                      maxLength={200}
                      aria-label={`Milestone ${i + 1} title`}
                      aria-invalid={errors[`milestone-${i}`] ? true : undefined}
                    />
                    <input
                      type="date"
                      value={m.eventDate}
                      onChange={(e) => updateMilestone(i, "eventDate", e.target.value)}
                      aria-label={`Milestone ${i + 1} date`}
                    />
                    <button
                      type="button"
                      className="pf-remove"
                      onClick={() => removeMilestone(i)}
                      aria-label={`Remove milestone ${i + 1}`}
                    >
                      ✕
                    </button>
                    <FieldError id={`pf-milestone-${i}-error`} message={errors[`milestone-${i}`]} />
                  </div>
                ))}

                {formData.milestones.length < 20 && (
                  <button type="button" className="pf-add-milestone" onClick={addMilestone}>
                    + Add milestone
                  </button>
                )}
              </fieldset>
            )}

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
              disabled={saving}
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
