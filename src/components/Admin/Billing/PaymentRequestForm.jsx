import { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";

import { createPaymentRequest, getApiErrorMessage } from "../../../services/billingApi";
import {
  poundsToPence,
  formatGBP,
  MIN_AMOUNT_PENCE,
  MAX_AMOUNT_PENCE,
  PAYMENT_REQUEST_REASON_LABELS,
} from "../../../utils/billingFormat";
import BillingModal from "../../Billing/BillingModal";
import { RequiredMark, FieldError } from "../../Billing/FieldBits";
import ClientSelect from "./ClientSelect";

const DESCRIPTION_MAX = 500;

// ids used to move focus to the first invalid field
const FIELD_IDS = { client: "pr-client", amount: "pr-amount", description: "pr-description" };

// One-off Stripe Checkout payment (mode "payment"). This is never a
// subscription -- the copy and the endpoint both keep it separate.
const PaymentRequestForm = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({ client: "", clientEmail: "", amount: "", description: "", reason: "outstanding_balance", billingEmail: "" });
  const [selectedClient, setSelectedClient] = useState(null);
  const [saving, setSaving] = useState(false);
  // { message, field } -- field-level messages render under that control,
  // API errors in the footer status area.
  const [error, setError] = useState(null);

  const set = (key) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error?.field === key) setError(null);
  };
  const amountPence = poundsToPence(form.amount);

  const fail = (field, message) => {
    setError({ field, message });
    document.getElementById(FIELD_IDS[field])?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!form.client) return fail("client", "Select the client to request payment from.");
    if (amountPence === null) return fail("amount", "Enter the amount in pounds, e.g. 1250 or 1250.50.");
    if (amountPence < MIN_AMOUNT_PENCE || amountPence > MAX_AMOUNT_PENCE) {
      return fail("amount", `The amount must be between ${formatGBP(MIN_AMOUNT_PENCE)} and ${formatGBP(MAX_AMOUNT_PENCE)}.`);
    }
    if (!form.description.trim()) return fail("description", "A description is required. The client sees it on the payment page.");

    const body = {
      client: form.client,
      amountPence,
      description: form.description.trim(),
      reason: form.reason,
      ...(form.billingEmail.trim() ? { billingEmail: form.billingEmail.trim() } : {}),
    };

    setSaving(true);
    setError(null);
    try {
      onCreated(await createPaymentRequest(body));
    } catch (err) {
      setError({ message: getApiErrorMessage(err, "Unable to create the payment request.") });
      setSaving(false);
    }
  };

  const fieldError = (field) => (error?.field === field ? error.message : "");
  const formError = error && !error.field ? error.message : "";
  const describedBy = (...ids) => ids.filter(Boolean).join(" ") || undefined;

  const clientName = selectedClient?.displayName?.trim();
  const amountValid = amountPence !== null && amountPence >= MIN_AMOUNT_PENCE && amountPence <= MAX_AMOUNT_PENCE;

  return (
    <BillingModal
      title="Create Payment Request"
      subtitle="Request a one-time payment from a client or recipient."
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
            <button
              type="submit"
              form="payment-request-form"
              className="bl-btn bl-btn--primary"
              disabled={saving}
              aria-busy={saving || undefined}
            >
              {saving && <span className="bl-spinner bl-spinner--sm" aria-hidden="true" />}
              {saving ? "Creating..." : "Create Payment Request"}
            </button>
          </div>
        </>
      }
    >
      <form id="payment-request-form" className="bl-form bl-form--sections" onSubmit={handleSubmit} noValidate>
        {/* ---------------- PAYMENT DETAILS ---------------- */}
        <section className="bl-form-section" aria-labelledby="pr-sec-details">
          <h3 id="pr-sec-details" className="bl-form-section-title">Payment details</h3>

          <div className="bl-field">
            <label htmlFor={FIELD_IDS.amount}>
              Amount <RequiredMark />
            </label>
            <div className="bl-input-affix bl-input-affix--lg">
              <span className="bl-input-affix-symbol" aria-hidden="true">
                £
              </span>
              <input
                id={FIELD_IDS.amount}
                inputMode="decimal"
                autoComplete="off"
                placeholder="0.00"
                value={form.amount}
                onChange={set("amount")}
                required
                aria-required="true"
                aria-invalid={Boolean(fieldError("amount")) || undefined}
                aria-describedby={describedBy(fieldError("amount") && "pr-amount-error", "pr-amount-hint")}
              />
              <span className="bl-input-affix-suffix" aria-hidden="true">
                GBP
              </span>
            </div>
            <FieldError id="pr-amount-error" message={fieldError("amount")} />
            <span id="pr-amount-hint" className="bl-hint">
              {amountValid
                ? `The client will be charged ${formatGBP(amountPence)} once.`
                : "Enter the amount you want to collect."}
            </span>
          </div>
        </section>

        {/* ---------------- RECIPIENT ---------------- */}
        <section className="bl-form-section" aria-labelledby="pr-sec-recipient">
          <h3 id="pr-sec-recipient" className="bl-form-section-title">Recipient</h3>

          <div className="bl-field">
            <label htmlFor={FIELD_IDS.client}>
              Client <RequiredMark />
            </label>
            <ClientSelect
              id={FIELD_IDS.client}
              value={form.client}
              onChange={(id, client) => {
                setForm((prev) => ({ ...prev, client: id, clientEmail: client?.email || "" }));
                setSelectedClient(client);
                if (error?.field === "client") setError(null);
              }}
              activeOnly
              required
              showSelected
              invalid={Boolean(fieldError("client"))}
              describedBy={fieldError("client") ? "pr-client-error" : undefined}
            />
            <FieldError id="pr-client-error" message={fieldError("client")} />
          </div>

          <div className="bl-field">
            <label htmlFor="pr-email">
              Billing email <span className="bl-optional">Optional</span>
            </label>
            <input
              id="pr-email"
              type="email"
              autoComplete="off"
              placeholder={form.clientEmail ? `Defaults to ${form.clientEmail}` : "Defaults to the client's email"}
              value={form.billingEmail}
              onChange={set("billingEmail")}
              maxLength={254}
              aria-describedby="pr-email-hint"
            />
            <span id="pr-email-hint" className="bl-hint">
              Use this if the payment link should be sent to a different email address.
            </span>
          </div>
        </section>

        {/* ---------------- DESCRIPTION + REASON ---------------- */}
        <section className="bl-form-section" aria-labelledby="pr-sec-about">
          <h3 id="pr-sec-about" className="bl-form-section-title">About this payment</h3>

          <div className="bl-field">
            <label htmlFor={FIELD_IDS.description}>
              Payment description <RequiredMark />
            </label>
            <textarea
              id={FIELD_IDS.description}
              rows={3}
              placeholder="e.g. Website development — October"
              value={form.description}
              onChange={set("description")}
              maxLength={DESCRIPTION_MAX}
              required
              aria-required="true"
              aria-invalid={Boolean(fieldError("description")) || undefined}
              aria-describedby={describedBy(fieldError("description") && "pr-description-error", "pr-description-hint")}
            />
            <FieldError id="pr-description-error" message={fieldError("description")} />
            <span id="pr-description-hint" className="bl-hint bl-hint--split">
              <span>Describe what this payment is for. The client sees this on the payment page.</span>
              <span aria-hidden="true">
                {form.description.length}/{DESCRIPTION_MAX}
              </span>
            </span>
          </div>

          <div className="bl-field">
            <label htmlFor="pr-reason">
              Payment reason <RequiredMark />
            </label>
            <select id="pr-reason" value={form.reason} onChange={set("reason")} required aria-required="true">
              {Object.entries(PAYMENT_REQUEST_REASON_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* ---------------- SUMMARY (read-only, from the form values) ---------------- */}
        <section className="bl-form-section" aria-labelledby="pr-sec-summary">
          <h3 id="pr-sec-summary" className="bl-form-section-title">Summary</h3>

          <dl className="bl-summary">
            <div className="bl-summary-row">
              <dt>Amount</dt>
              <dd className="bl-summary-amount">{amountValid ? formatGBP(amountPence) : "—"}</dd>
            </div>
            <div className="bl-summary-row">
              <dt>Recipient</dt>
              <dd>{clientName || selectedClient?.email || "No client selected"}</dd>
            </div>
            <div className="bl-summary-row">
              <dt>Reason</dt>
              <dd>{PAYMENT_REQUEST_REASON_LABELS[form.reason]}</dd>
            </div>
            <div className="bl-summary-row">
              <dt>Payment type</dt>
              <dd>One-time payment</dd>
            </div>
          </dl>
        </section>
      </form>
    </BillingModal>
  );
};

export default PaymentRequestForm;
