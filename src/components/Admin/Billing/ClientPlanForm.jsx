import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

import {
  createClientPlan,
  updateClientPlan,
  listPublishedServices,
  getApiErrorMessage,
} from "../../../services/billingApi";
import {
  poundsToPence,
  penceToPoundsInput,
  toDateInputValue,
  clientLabel,
  formatGBP,
  MIN_AMOUNT_PENCE,
  MAX_AMOUNT_PENCE,
  OPEN_SUBSCRIPTION_STATUSES,
  PLAN_STATUS_LABELS,
} from "../../../utils/billingFormat";
import { useBillingQuery } from "../../Billing/useBillingQuery";
import BillingModal from "../../Billing/BillingModal";
import ClientSelect from "./ClientSelect";

const idOf = (ref) => (ref && typeof ref === "object" ? ref._id : ref) || "";

const toFormState = (plan) => ({
  client: idOf(plan?.client),
  name: plan?.name || "",
  description: plan?.description || "",
  amount: penceToPoundsInput(plan?.amountPence),
  startDate: toDateInputValue(plan?.startDate),
  billingEmail: plan?.billingEmail || "",
  status: plan?.status || "draft",
  servicesIncluded: (plan?.servicesIncluded || []).map((s) => ({
    service: idOf(s.service),
    clientService: idOf(s.clientService),
    label: s.label || "",
    description: s.description || "",
  })),
  features: [...(plan?.features || [])],
  deliverables: [...(plan?.deliverables || [])],
  limits: (plan?.limits || []).map((l) => ({ label: l.label || "", value: l.value || "", unit: l.unit || "" })),
  customFields: (plan?.customFields || []).map((f) => ({
    label: f.label || "",
    value: f.value || "",
    clientVisible: f.clientVisible !== false,
  })),
  clientNotes: plan?.clientNotes || "",
  adminNotes: plan?.adminNotes || "",
});

// Turns the form into the backend body. Only admin-authored plan content is
// ever sent -- no billing/Stripe fields exist in this form at all (the
// backend would strip them anyway). Returns { body } or { error }.
const buildBody = (form, { isEdit }) => {
  const amountPence = poundsToPence(form.amount);
  if (amountPence === null) return { error: "Enter the monthly amount in pounds, e.g. 499 or 499.99." };
  if (amountPence < MIN_AMOUNT_PENCE || amountPence > MAX_AMOUNT_PENCE) {
    return { error: `The monthly amount must be between ${formatGBP(MIN_AMOUNT_PENCE)} and ${formatGBP(MAX_AMOUNT_PENCE)}.` };
  }
  if (!form.name.trim()) return { error: "Plan name is required." };
  if (!isEdit && !form.client) return { error: "Select the client this plan is for." };

  const services = form.servicesIncluded.filter((s) => s.label.trim() || s.service || s.description.trim());
  if (services.some((s) => !s.label.trim())) return { error: "Each included service needs a label." };

  const limits = form.limits.filter((l) => l.label.trim() || l.value.trim() || l.unit.trim());
  if (limits.some((l) => !l.label.trim() || !l.value.trim())) return { error: "Each limit needs a label and a value." };

  const customFields = form.customFields.filter((f) => f.label.trim() || f.value.trim());
  if (customFields.some((f) => !f.label.trim() || !f.value.trim())) {
    return { error: "Each custom field needs a label and a value." };
  }

  const body = {
    name: form.name.trim(),
    amountPence,
    status: form.status,
    servicesIncluded: services.map((s) => ({
      label: s.label.trim(),
      ...(s.description.trim() ? { description: s.description.trim() } : {}),
      ...(s.service ? { service: s.service } : {}),
      ...(s.clientService ? { clientService: s.clientService } : {}),
    })),
    features: form.features.map((f) => f.trim()).filter(Boolean),
    deliverables: form.deliverables.map((d) => d.trim()).filter(Boolean),
    limits: limits.map((l) => ({
      label: l.label.trim(),
      value: l.value.trim(),
      ...(l.unit.trim() ? { unit: l.unit.trim() } : {}),
    })),
    customFields: customFields.map((f) => ({ label: f.label.trim(), value: f.value.trim(), clientVisible: f.clientVisible })),
  };

  // Free-text fields: on edit "" clears them; on create empty ones are omitted.
  for (const key of ["description", "clientNotes", "adminNotes"]) {
    const v = form[key].trim();
    if (v || isEdit) body[key] = v;
  }
  // billingEmail: "" clears it on update (falls back to the login email).
  const email = form.billingEmail.trim();
  if (email || isEdit) body.billingEmail = email;
  // startDate can't be sent empty (the backend coerces it to a date).
  if (form.startDate) body.startDate = form.startDate;

  if (!isEdit) body.client = form.client;
  return { body };
};

/**
 * Create (no `plan`) or edit an admin-authored client plan.
 * @param {{ plan?: import("../../../types/billing").ClientPlan, onClose: () => void, onSaved: (plan: object) => void }} props
 */
const ClientPlanForm = ({ plan, onClose, onSaved }) => {
  const isEdit = Boolean(plan);
  const [form, setForm] = useState(() => toFormState(plan));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // The Stripe Price behind an open subscription is fixed -- the backend
  // answers 409 to an amount change, so the field is locked up front.
  const amountLocked = isEdit && OPEN_SUBSCRIPTION_STATUSES.includes(plan.billing?.status);

  const { status: servicesStatus, data: servicesData } = useBillingQuery(listPublishedServices);
  const catalogue = servicesData?.items || [];

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const setRows = (key, rows) => setForm((prev) => ({ ...prev, [key]: rows }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { body, error: validationError } = buildBody(form, { isEdit });
    if (validationError) {
      setError(validationError);
      return;
    }
    if (amountLocked) delete body.amountPence;

    setSaving(true);
    setError("");
    try {
      const saved = isEdit ? await updateClientPlan(plan._id, body) : await createClientPlan(body);
      onSaved(saved);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to save this plan."));
      setSaving(false);
    }
  };

  return (
    <BillingModal
      title={isEdit ? `Edit plan: ${plan.name}` : "Create custom plan"}
      onClose={onClose}
      busy={saving}
      wide
      footer={
        <>
          <button type="button" className="bl-btn bl-btn--ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" form="client-plan-form" className="bl-btn bl-btn--primary" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create plan"}
          </button>
        </>
      }
    >
      <form id="client-plan-form" className="bl-form" onSubmit={handleSubmit} noValidate>
        {error && <p className="bl-form-error">{error}</p>}

        <div className="bl-form-grid">
          <div className="bl-field bl-field--full">
            <label htmlFor="plan-client">Client *</label>
            {isEdit ? (
              <input id="plan-client" value={`${clientLabel(plan.client)} — ${plan.client?.email || ""}`} disabled />
            ) : (
              <ClientSelect
                id="plan-client"
                value={form.client}
                onChange={(id) => setForm((prev) => ({ ...prev, client: id }))}
                activeOnly
                required
              />
            )}
          </div>

          <div className="bl-field">
            <label htmlFor="plan-name">Plan name *</label>
            <input id="plan-name" value={form.name} onChange={set("name")} maxLength={150} required />
          </div>

          <div className="bl-field">
            <label htmlFor="plan-amount">Monthly amount (£) *</label>
            <input
              id="plan-amount"
              inputMode="decimal"
              placeholder="499.00"
              value={form.amount}
              onChange={set("amount")}
              disabled={amountLocked}
              required
            />
            {amountLocked && (
              <span className="bl-hint">
                Locked while a subscription is open. Cancel the subscription before changing the amount.
              </span>
            )}
          </div>

          <div className="bl-field">
            <label htmlFor="plan-start">Start date</label>
            <input id="plan-start" type="date" value={form.startDate} onChange={set("startDate")} />
            <span className="bl-hint">Shown to the client. Billing starts when they complete the payment link.</span>
          </div>

          <div className="bl-field">
            <label htmlFor="plan-status">Plan status</label>
            <select id="plan-status" value={form.status} onChange={set("status")}>
              {Object.entries(PLAN_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <span className="bl-hint">Drafts are hidden from the client until billing starts. This doesn't pause Stripe.</span>
          </div>

          <div className="bl-field bl-field--full">
            <label htmlFor="plan-billing-email">Billing email (optional)</label>
            <input
              id="plan-billing-email"
              type="email"
              placeholder="Defaults to the client's login email"
              value={form.billingEmail}
              onChange={set("billingEmail")}
              maxLength={254}
            />
          </div>

          <div className="bl-field bl-field--full">
            <label htmlFor="plan-description">Description</label>
            <textarea id="plan-description" rows={3} value={form.description} onChange={set("description")} maxLength={5000} />
          </div>
        </div>

        <fieldset className="bl-fieldset">
          <legend>Services included</legend>
          {form.servicesIncluded.map((row, i) => (
            <div className="bl-row" key={i}>
              <select
                aria-label="Catalogue service"
                value={row.service}
                onChange={(e) => {
                  const svc = catalogue.find((s) => s._id === e.target.value);
                  const rows = [...form.servicesIncluded];
                  rows[i] = { ...row, service: e.target.value, label: row.label || svc?.title || "" };
                  setRows("servicesIncluded", rows);
                }}
              >
                <option value="">{servicesStatus === "loading" ? "Loading services..." : "Custom (no catalogue link)"}</option>
                {catalogue.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title}
                  </option>
                ))}
              </select>
              <input
                aria-label="Service label"
                placeholder="Label *"
                value={row.label}
                maxLength={200}
                onChange={(e) => updateRow(form.servicesIncluded, i, { label: e.target.value }, (r) => setRows("servicesIncluded", r))}
              />
              <input
                aria-label="Service description"
                placeholder="Description"
                value={row.description}
                maxLength={1000}
                onChange={(e) =>
                  updateRow(form.servicesIncluded, i, { description: e.target.value }, (r) => setRows("servicesIncluded", r))
                }
              />
              <RemoveButton onClick={() => setRows("servicesIncluded", form.servicesIncluded.filter((_, j) => j !== i))} />
            </div>
          ))}
          <AddButton
            label="Add service"
            onClick={() =>
              setRows("servicesIncluded", [...form.servicesIncluded, { service: "", clientService: "", label: "", description: "" }])
            }
          />
        </fieldset>

        <StringListField label="Features" rows={form.features} onChange={(r) => setRows("features", r)} addLabel="Add feature" />
        <StringListField
          label="Deliverables"
          rows={form.deliverables}
          onChange={(r) => setRows("deliverables", r)}
          addLabel="Add deliverable"
        />

        <fieldset className="bl-fieldset">
          <legend>Limits</legend>
          {form.limits.map((row, i) => (
            <div className="bl-row" key={i}>
              <input
                aria-label="Limit label"
                placeholder="Label * (e.g. Ad spend managed)"
                value={row.label}
                maxLength={200}
                onChange={(e) => updateRow(form.limits, i, { label: e.target.value }, (r) => setRows("limits", r))}
              />
              <input
                aria-label="Limit value"
                placeholder="Value * (e.g. 5000)"
                value={row.value}
                maxLength={100}
                onChange={(e) => updateRow(form.limits, i, { value: e.target.value }, (r) => setRows("limits", r))}
              />
              <input
                aria-label="Limit unit"
                placeholder="Unit (e.g. GBP)"
                value={row.unit}
                maxLength={50}
                onChange={(e) => updateRow(form.limits, i, { unit: e.target.value }, (r) => setRows("limits", r))}
              />
              <RemoveButton onClick={() => setRows("limits", form.limits.filter((_, j) => j !== i))} />
            </div>
          ))}
          <AddButton label="Add limit" onClick={() => setRows("limits", [...form.limits, { label: "", value: "", unit: "" }])} />
        </fieldset>

        <fieldset className="bl-fieldset">
          <legend>Custom fields</legend>
          {form.customFields.map((row, i) => (
            <div className="bl-row" key={i}>
              <input
                aria-label="Field label"
                placeholder="Label * (e.g. Account manager)"
                value={row.label}
                maxLength={100}
                onChange={(e) => updateRow(form.customFields, i, { label: e.target.value }, (r) => setRows("customFields", r))}
              />
              <input
                aria-label="Field value"
                placeholder="Value *"
                value={row.value}
                maxLength={1000}
                onChange={(e) => updateRow(form.customFields, i, { value: e.target.value }, (r) => setRows("customFields", r))}
              />
              <label className="bl-check">
                <input
                  type="checkbox"
                  checked={row.clientVisible}
                  onChange={(e) =>
                    updateRow(form.customFields, i, { clientVisible: e.target.checked }, (r) => setRows("customFields", r))
                  }
                />
                Visible to client
              </label>
              <RemoveButton onClick={() => setRows("customFields", form.customFields.filter((_, j) => j !== i))} />
            </div>
          ))}
          <AddButton
            label="Add custom field"
            onClick={() => setRows("customFields", [...form.customFields, { label: "", value: "", clientVisible: true }])}
          />
        </fieldset>

        <div className="bl-form-grid">
          <div className="bl-field">
            <label htmlFor="plan-client-notes">Client-visible notes</label>
            <textarea id="plan-client-notes" rows={4} value={form.clientNotes} onChange={set("clientNotes")} maxLength={5000} />
          </div>
          <div className="bl-field">
            <label htmlFor="plan-admin-notes">Admin notes (never shown to the client)</label>
            <textarea id="plan-admin-notes" rows={4} value={form.adminNotes} onChange={set("adminNotes")} maxLength={5000} />
          </div>
        </div>
      </form>
    </BillingModal>
  );
};

const updateRow = (rows, index, patch, commit) => {
  const next = [...rows];
  next[index] = { ...next[index], ...patch };
  commit(next);
};

const StringListField = ({ label, rows, onChange, addLabel }) => (
  <fieldset className="bl-fieldset">
    <legend>{label}</legend>
    {rows.map((value, i) => (
      <div className="bl-row" key={i}>
        <input
          aria-label={`${label} ${i + 1}`}
          value={value}
          maxLength={300}
          onChange={(e) => {
            const next = [...rows];
            next[i] = e.target.value;
            onChange(next);
          }}
        />
        <RemoveButton onClick={() => onChange(rows.filter((_, j) => j !== i))} />
      </div>
    ))}
    <AddButton label={addLabel} onClick={() => onChange([...rows, ""])} />
  </fieldset>
);

const AddButton = ({ label, onClick }) => (
  <button type="button" className="bl-btn bl-btn--ghost bl-btn--sm" onClick={onClick}>
    <FaPlus aria-hidden="true" /> {label}
  </button>
);

const RemoveButton = ({ onClick }) => (
  <button type="button" className="bl-icon-btn" onClick={onClick} aria-label="Remove row">
    <FaTrash aria-hidden="true" />
  </button>
);

export default ClientPlanForm;
