import { useState } from "react";
import { FaPlus, FaTrash, FaExclamationCircle } from "react-icons/fa";

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
  formatDate,
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
// backend would strip them anyway). Returns { body } or { error, field }
// -- `field` lets the form show the message next to the offending control.
// Checked top-to-bottom in form order.
const buildBody = (form, { isEdit }) => {
  if (!isEdit && !form.client) return { error: "Select a client to continue.", field: "client" };
  if (!form.name.trim()) return { error: "Enter a plan name.", field: "name" };

  const amountPence = poundsToPence(form.amount);
  if (amountPence === null) return { error: "Enter the monthly amount in pounds, e.g. 499 or 499.99.", field: "amount" };
  if (amountPence < MIN_AMOUNT_PENCE || amountPence > MAX_AMOUNT_PENCE) {
    return {
      error: `Enter an amount between ${formatGBP(MIN_AMOUNT_PENCE)} and ${formatGBP(MAX_AMOUNT_PENCE)}.`,
      field: "amount",
    };
  }

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
 * Create (no `plan`) or edit an admin-authored client plan. When created from
 * a client's plan request, `planRequest` ({ _id, client }) fixes the client
 * and `initial` prefills form fields; the backend then marks that request
 * plan_created.
 * @param {{ plan?: import("../../../types/billing").ClientPlan, planRequest?: { _id: string, client: object }, initial?: object, onClose: () => void, onSaved: (plan: object) => void }} props
 */
const ClientPlanForm = ({ plan, planRequest, initial, onClose, onSaved }) => {
  const isEdit = Boolean(plan);
  const clientLocked = isEdit || Boolean(planRequest);
  const [form, setForm] = useState(() => ({
    ...toFormState(plan),
    ...(planRequest ? { client: idOf(planRequest.client) } : {}),
    ...initial,
  }));
  const [saving, setSaving] = useState(false);
  // { message, field } -- field-level messages render under that control,
  // anything else (row validation, API errors) in the footer status area.
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(isEdit ? plan.client : planRequest?.client || null);

  // The Stripe Price behind an open subscription is fixed -- the backend
  // answers 409 to an amount change, so the field is locked up front.
  const amountLocked = isEdit && OPEN_SUBSCRIPTION_STATUSES.includes(plan.billing?.status);

  const { status: servicesStatus, data: servicesData } = useBillingQuery(listPublishedServices);
  const catalogue = servicesData?.items || [];

  const set = (key) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error?.field === key) setError(null);
  };
  const setRows = (key, rows) => setForm((prev) => ({ ...prev, [key]: rows }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { body, error: validationError, field } = buildBody(form, { isEdit });
    if (validationError) {
      setError({ message: validationError, field });
      const target = field && document.getElementById(FIELD_IDS[field]);
      if (target) target.focus();
      return;
    }
    if (amountLocked) delete body.amountPence;
    if (planRequest && !isEdit) body.planRequest = planRequest._id;

    setSaving(true);
    setError(null);
    try {
      const saved = isEdit ? await updateClientPlan(plan._id, body) : await createClientPlan(body);
      onSaved(saved);
    } catch (err) {
      setError({ message: getApiErrorMessage(err, "Unable to save this plan.") });
      setSaving(false);
    }
  };

  const fieldError = (field) => (error?.field === field ? error.message : "");
  const formError = error && !error.field ? error.message : "";
  const clientEmail = selectedClient?.email;
  const clientName = selectedClient?.displayName?.trim();

  return (
    <BillingModal
      title={isEdit ? `Edit plan: ${plan.name}` : planRequest ? "Create plan from request" : "Create custom plan"}
      subtitle={
        isEdit
          ? "Update the plan details shown to the client."
          : planRequest
            ? "Prefilled from the client's request. Set the monthly amount, then send the payment link from the plan."
            : "Set the client's monthly billing terms and payment details."
      }
      onClose={onClose}
      busy={saving}
      size="form"
      footer={
        <>
          <div className="bl-modal-footer-status" role="status" aria-live="polite">
            {formError && (
              <p className="bl-inline-error">
                <FaExclamationCircle aria-hidden="true" />
                <span>{formError}</span>
              </p>
            )}
          </div>
          <div className="bl-modal-footer-actions">
            <button type="button" className="bl-btn bl-btn--ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" form="client-plan-form" className="bl-btn bl-btn--primary" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save changes" : "Create plan"}
            </button>
          </div>
        </>
      }
    >
      <form id="client-plan-form" className="bl-form bl-form--sections" onSubmit={handleSubmit} noValidate>
        {/* ---------------- CLIENT ---------------- */}
        <section className="bl-form-section" aria-labelledby="plan-sec-client">
          <h3 id="plan-sec-client" className="bl-form-section-title">Client</h3>

          <div className="bl-field">
            <label htmlFor={FIELD_IDS.client}>
              Client <RequiredMark />
            </label>
            {clientLocked ? (
              <div className="bl-client-chip bl-client-chip--static" id={FIELD_IDS.client}>
                <span className="bl-client-chip-avatar" aria-hidden="true">
                  {(clientName || clientEmail || "?").charAt(0).toUpperCase()}
                </span>
                <span className="bl-client-chip-text">
                  <strong>{clientName || clientEmail || "—"}</strong>
                  {clientName && clientEmail && <span>{clientEmail}</span>}
                  {selectedClient?.profile?.companyName && <span>{selectedClient.profile.companyName}</span>}
                </span>
              </div>
            ) : (
              <ClientSelect
                id={FIELD_IDS.client}
                value={form.client}
                onChange={(id, client) => {
                  setForm((prev) => ({ ...prev, client: id }));
                  setSelectedClient(client);
                  if (error?.field === "client") setError(null);
                }}
                activeOnly
                required
                showSelected
                invalid={Boolean(fieldError("client"))}
                describedBy={fieldError("client") ? "plan-client-error" : undefined}
              />
            )}
            <FieldError id="plan-client-error" message={fieldError("client")} />
          </div>
        </section>

        {/* ---------------- PLAN DETAILS ---------------- */}
        <section className="bl-form-section" aria-labelledby="plan-sec-details">
          <h3 id="plan-sec-details" className="bl-form-section-title">Plan details</h3>

          <div className="bl-form-grid">
            <div className="bl-field">
              <label htmlFor={FIELD_IDS.name}>
                Plan name <RequiredMark />
              </label>
              <input
                id={FIELD_IDS.name}
                value={form.name}
                onChange={set("name")}
                maxLength={150}
                placeholder="e.g. Growth retainer"
                required
                aria-required="true"
                aria-invalid={Boolean(fieldError("name")) || undefined}
                aria-describedby={fieldError("name") ? "plan-name-error" : undefined}
              />
              <FieldError id="plan-name-error" message={fieldError("name")} />
            </div>

            <div className="bl-field">
              <label htmlFor={FIELD_IDS.amount}>
                Monthly amount (£) <RequiredMark />
              </label>
              <div className={`bl-input-affix${amountLocked ? " is-disabled" : ""}`}>
                <span className="bl-input-affix-symbol" aria-hidden="true">
                  £
                </span>
                <input
                  id={FIELD_IDS.amount}
                  inputMode="decimal"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={set("amount")}
                  disabled={amountLocked}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(fieldError("amount")) || undefined}
                  aria-describedby={[fieldError("amount") && "plan-amount-error", "plan-amount-hint"]
                    .filter(Boolean)
                    .join(" ")}
                />
                <span className="bl-input-affix-suffix" aria-hidden="true">
                  / month
                </span>
              </div>
              <FieldError id="plan-amount-error" message={fieldError("amount")} />
              <span id="plan-amount-hint" className="bl-hint">
                {amountLocked
                  ? "Locked while a subscription is open. Cancel it before changing the amount."
                  : "GBP, charged monthly once the client completes payment."}
              </span>
            </div>

            <div className="bl-field">
              <label htmlFor="plan-start">Start date</label>
              <input
                id="plan-start"
                type="date"
                value={form.startDate}
                onChange={set("startDate")}
                aria-describedby="plan-start-hint"
              />
              <span id="plan-start-hint" className="bl-hint">
                {form.startDate ? (
                  <>
                    Starts <strong>{formatDate(`${form.startDate}T00:00:00Z`)}</strong>. Billing begins when the client
                    pays.
                  </>
                ) : (
                  "Shown to the client. Billing begins when the client pays."
                )}
              </span>
            </div>

            <div className="bl-field">
              <label htmlFor="plan-status">Plan status</label>
              <select id="plan-status" value={form.status} onChange={set("status")} aria-describedby="plan-status-hint">
                {Object.entries(PLAN_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <span id="plan-status-hint" className="bl-hint">
                Draft plans stay hidden from the client until billing starts. Status doesn't pause Stripe billing.
              </span>
            </div>
          </div>
        </section>

        {/* ---------------- BILLING DETAILS ---------------- */}
        <section className="bl-form-section" aria-labelledby="plan-sec-billing">
          <h3 id="plan-sec-billing" className="bl-form-section-title">Billing details</h3>

          <div className="bl-field">
            <label htmlFor="plan-billing-email">
              Billing email <span className="bl-optional">Optional</span>
            </label>
            <input
              id="plan-billing-email"
              type="email"
              placeholder={clientEmail || "client@company.com"}
              value={form.billingEmail}
              onChange={set("billingEmail")}
              maxLength={254}
              aria-describedby="plan-billing-email-hint"
            />
            <span id="plan-billing-email-hint" className="bl-hint">
              {clientEmail
                ? `Leave blank to send invoices and payment links to ${clientEmail}.`
                : "Leave blank to use the client's login email."}
            </span>
          </div>

          <div className="bl-field">
            <label htmlFor="plan-description">
              Description <span className="bl-optional">Optional</span>
            </label>
            <textarea
              id="plan-description"
              rows={4}
              value={form.description}
              onChange={set("description")}
              maxLength={5000}
              placeholder="Add any notes or billing details for this plan..."
            />
          </div>
        </section>

        {/* ---------------- PLAN CONTENT ---------------- */}
        <section className="bl-form-section" aria-labelledby="plan-sec-content">
          <h3 id="plan-sec-content" className="bl-form-section-title">
            Plan content <span className="bl-optional">Optional</span>
          </h3>

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

        </section>

        {/* ---------------- NOTES ---------------- */}
        <section className="bl-form-section" aria-labelledby="plan-sec-notes">
          <h3 id="plan-sec-notes" className="bl-form-section-title">
            Notes <span className="bl-optional">Optional</span>
          </h3>

          <div className="bl-form-grid">
            <div className="bl-field">
              <label htmlFor="plan-client-notes">Client-visible notes</label>
              <textarea id="plan-client-notes" rows={3} value={form.clientNotes} onChange={set("clientNotes")} maxLength={5000} />
            </div>
            <div className="bl-field">
              <label htmlFor="plan-admin-notes">Admin notes</label>
              <textarea id="plan-admin-notes" rows={3} value={form.adminNotes} onChange={set("adminNotes")} maxLength={5000} />
              <span className="bl-hint">Internal only. Never shown to the client.</span>
            </div>
          </div>
        </section>
      </form>
    </BillingModal>
  );
};

// ids used to move focus to the first invalid field
const FIELD_IDS = { client: "plan-client", name: "plan-name", amount: "plan-amount" };

const RequiredMark = () => (
  <span className="bl-required" aria-hidden="true">
    *
  </span>
);

const FieldError = ({ id, message }) =>
  message ? (
    <p id={id} className="bl-inline-error">
      <FaExclamationCircle aria-hidden="true" />
      <span>{message}</span>
    </p>
  ) : null;

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
