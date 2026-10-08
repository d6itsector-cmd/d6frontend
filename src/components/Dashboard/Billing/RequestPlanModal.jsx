import { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";

import { createPlanRequest, listServiceCatalogue, getApiErrorMessage } from "../../../services/billingApi";
import { poundsToPence, formatGBP, MAX_AMOUNT_PENCE } from "../../../utils/billingFormat";
import { useBillingQuery } from "../../Billing/useBillingQuery";
import BillingModal from "../../Billing/BillingModal";
import { RequiredMark, FieldError } from "../../Billing/FieldBits";

const OTHER = "other";
const FIELD_IDS = { service: "pr-service", serviceName: "pr-service-name", requirements: "pr-requirements", budget: "pr-budget" };

// Returns { body } or { error, field }, checked in form order. The client is
// never part of the body -- the backend takes it from the signed-in user.
const buildBody = (form) => {
  if (!form.service) return { error: "Choose a service, or pick Other and describe your project.", field: "service" };
  if (form.service === OTHER && !form.serviceName.trim()) {
    return { error: "Tell us the service or project you need.", field: "serviceName" };
  }
  if (!form.requirements.trim()) return { error: "Describe what you need so our team can review it.", field: "requirements" };

  const body = { requirements: form.requirements.trim() };
  if (form.service === OTHER) body.serviceName = form.serviceName.trim();
  else body.service = form.service;

  if (form.budget.trim()) {
    const pence = poundsToPence(form.budget);
    if (pence === null || pence < 1 || pence > MAX_AMOUNT_PENCE) {
      return { error: "Enter the budget in pounds, e.g. 500 or 499.99, or leave it blank.", field: "budget" };
    }
    body.preferredBudgetPence = pence;
  }
  if (form.additionalDetails.trim()) body.additionalDetails = form.additionalDetails.trim();
  return { body };
};

const RequestPlanModal = ({ onClose, onSubmitted }) => {
  const [form, setForm] = useState({ service: "", serviceName: "", requirements: "", budget: "", additionalDetails: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null); // { message, field? }

  const { status: catalogueStatus, data: catalogueData } = useBillingQuery(listServiceCatalogue);
  const catalogue = catalogueData?.items || [];

  const set = (key) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error?.field === key) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    const { body, error: validationError, field } = buildBody(form);
    if (validationError) {
      setError({ message: validationError, field });
      document.getElementById(FIELD_IDS[field])?.focus();
      return;
    }

    setSaving(true);
    setError(null);
    try {
      onSubmitted(await createPlanRequest(body));
    } catch (err) {
      setError({ message: getApiErrorMessage(err, "We couldn't send your request. Please try again.") });
      setSaving(false);
    }
  };

  const fieldError = (field) => (error?.field === field ? error.message : "");
  const formError = error && !error.field ? error.message : "";
  const describedBy = (field, hintId) => [fieldError(field) && `${FIELD_IDS[field]}-error`, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <BillingModal
      title="Request a Plan"
      subtitle="Tell us what service or project you need and our team will review your request."
      onClose={onClose}
      busy={saving}
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
            <button type="submit" form="plan-request-form" className="bl-btn bl-btn--primary" disabled={saving}>
              {saving ? "Sending..." : "Send Request"}
            </button>
          </div>
        </>
      }
    >
      <form id="plan-request-form" className="bl-form" onSubmit={handleSubmit} noValidate>
        <div className="bl-field">
          <label htmlFor={FIELD_IDS.service}>
            Service / Project <RequiredMark />
          </label>
          <select
            id={FIELD_IDS.service}
            value={form.service}
            onChange={set("service")}
            aria-required="true"
            aria-invalid={Boolean(fieldError("service")) || undefined}
            aria-describedby={describedBy("service")}
          >
            <option value="">{catalogueStatus === "loading" ? "Loading services..." : "Select a service"}</option>
            {catalogue.map((s) => (
              <option key={s._id} value={s._id}>
                {s.title}
              </option>
            ))}
            <option value={OTHER}>Other / custom project</option>
          </select>
          <FieldError id={`${FIELD_IDS.service}-error`} message={fieldError("service")} />
        </div>

        {form.service === OTHER && (
          <div className="bl-field">
            <label htmlFor={FIELD_IDS.serviceName}>
              Project name <RequiredMark />
            </label>
            <input
              id={FIELD_IDS.serviceName}
              value={form.serviceName}
              onChange={set("serviceName")}
              maxLength={150}
              placeholder="e.g. Website Development"
              aria-required="true"
              aria-invalid={Boolean(fieldError("serviceName")) || undefined}
              aria-describedby={describedBy("serviceName")}
            />
            <FieldError id={`${FIELD_IDS.serviceName}-error`} message={fieldError("serviceName")} />
          </div>
        )}

        <div className="bl-field">
          <label htmlFor={FIELD_IDS.requirements}>
            Requirements <RequiredMark />
          </label>
          <textarea
            id={FIELD_IDS.requirements}
            rows={5}
            value={form.requirements}
            onChange={set("requirements")}
            maxLength={5000}
            placeholder="What do you need, and what would you like to achieve?"
            aria-required="true"
            aria-invalid={Boolean(fieldError("requirements")) || undefined}
            aria-describedby={describedBy("requirements")}
          />
          <FieldError id={`${FIELD_IDS.requirements}-error`} message={fieldError("requirements")} />
        </div>

        <div className="bl-field">
          <label htmlFor={FIELD_IDS.budget}>
            Preferred budget <span className="bl-optional">Optional</span>
          </label>
          <div className="bl-input-affix">
            <span className="bl-input-affix-symbol" aria-hidden="true">
              £
            </span>
            <input
              id={FIELD_IDS.budget}
              inputMode="decimal"
              placeholder="0.00"
              value={form.budget}
              onChange={set("budget")}
              aria-invalid={Boolean(fieldError("budget")) || undefined}
              aria-describedby={describedBy("budget", "pr-budget-hint")}
            />
          </div>
          <FieldError id={`${FIELD_IDS.budget}-error`} message={fieldError("budget")} />
          <span id="pr-budget-hint" className="bl-hint">
            GBP. A rough figure helps us suggest the right plan{form.budget && poundsToPence(form.budget) ? ` (${formatGBP(poundsToPence(form.budget))})` : ""}.
          </span>
        </div>

        <div className="bl-field">
          <label htmlFor="pr-details">
            Additional details <span className="bl-optional">Optional</span>
          </label>
          <textarea
            id="pr-details"
            rows={3}
            value={form.additionalDetails}
            onChange={set("additionalDetails")}
            maxLength={5000}
            placeholder="Timelines, links, anything else we should know"
          />
        </div>
      </form>
    </BillingModal>
  );
};

export default RequestPlanModal;
