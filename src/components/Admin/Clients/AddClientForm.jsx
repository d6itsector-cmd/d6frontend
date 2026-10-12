import { useState } from "react";
import "./ClientForm.css";
import "../../Billing/Billing.css";
import api from "../../../services/api";
import { RequiredMark, FieldError } from "../../Billing/FieldBits";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Checks mirror the backend schema so most mistakes are caught before the
// request; the server's field errors (e.g. "already exists") are shown too.
const validate = (form) => {
  const errors = {};
  if (!form.displayName.trim()) errors.displayName = "Enter the client's name";
  if (!form.email.trim()) errors.email = "Enter the client's email address";
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = "Enter a valid email address";
  return errors;
};

// Admin "Add Client". The account is created on the server (Firebase sign-in
// + client record, role always "client"); the client gets an email with a
// link to set their own password -- no password is entered here.
const AddClientForm = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({ displayName: "", email: "", companyName: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      setError("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const res = await api.post("/admin/users/clients", {
        displayName: form.displayName.trim(),
        email: form.email.trim(),
        profile: {
          companyName: form.companyName.trim() || undefined,
          phone: form.phone.trim() || undefined,
        },
      });
      onCreated(res.data);
    } catch (err) {
      const data = err.response?.data;
      // Server field keys: displayName, email, profile.companyName, profile.phone
      const fieldErrors = {};
      Object.entries(data?.errors || {}).forEach(([key, message]) => {
        fieldErrors[key.replace(/^profile\./, "")] = message;
      });
      setErrors(fieldErrors);
      setError(data?.message || "Unable to add this client. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fieldProps = (name) => ({
    id: `add-client-${name}`,
    name,
    value: form[name],
    onChange: handleChange,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `add-client-${name}-error` : undefined,
  });

  return (
    <div className="client-modal">

      <div className="client-form-card" role="dialog" aria-modal="true" aria-labelledby="add-client-title">

        <div className="client-form-header">
          <h2 id="add-client-title">Add Client</h2>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close"
            disabled={saving}
          >
            ✕
          </button>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit} noValidate>

          <div className="form-grid">

            <div className="form-group">
              <label htmlFor="add-client-displayName">Client Name <RequiredMark /></label>
              <input type="text" placeholder="Enter client name" maxLength={150} autoComplete="off" {...fieldProps("displayName")} />
              <FieldError id="add-client-displayName-error" message={errors.displayName} />
            </div>

            <div className="form-group">
              <label htmlFor="add-client-email">Email <RequiredMark /></label>
              <input type="email" placeholder="client@company.com" maxLength={254} autoComplete="off" {...fieldProps("email")} />
              <FieldError id="add-client-email-error" message={errors.email} />
            </div>

            <div className="form-group">
              <label htmlFor="add-client-companyName">Company Name</label>
              <input type="text" placeholder="Company Name" maxLength={150} {...fieldProps("companyName")} />
              <FieldError id="add-client-companyName-error" message={errors.companyName} />
            </div>

            <div className="form-group">
              <label htmlFor="add-client-phone">Phone</label>
              <input type="text" placeholder="+44 7700 900000" maxLength={30} {...fieldProps("phone")} />
              <FieldError id="add-client-phone-error" message={errors.phone} />
            </div>

            <p className="form-group full-width add-client-note">
              We'll email the client a secure link to set their own password. They sign in to the normal
              client dashboard — no admin access.
            </p>

          </div>

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={saving}
            >
              {saving ? "Adding..." : "Add Client"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddClientForm;
