import { useState } from "react";

import { createPaymentRequest, getApiErrorMessage } from "../../../services/billingApi";
import {
  poundsToPence,
  formatGBP,
  MIN_AMOUNT_PENCE,
  MAX_AMOUNT_PENCE,
  PAYMENT_REQUEST_REASON_LABELS,
} from "../../../utils/billingFormat";
import BillingModal from "../../Billing/BillingModal";
import ClientSelect from "./ClientSelect";

// One-off Stripe Checkout payment (mode "payment"). This is never a
// subscription -- the copy and the endpoint both keep it separate.
const PaymentRequestForm = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({ client: "", clientEmail: "", amount: "", description: "", reason: "outstanding_balance", billingEmail: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const amountPence = poundsToPence(form.amount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.client) return setError("Select the client to request payment from.");
    if (amountPence === null) return setError("Enter the amount in pounds, e.g. 1250 or 1250.50.");
    if (amountPence < MIN_AMOUNT_PENCE || amountPence > MAX_AMOUNT_PENCE) {
      return setError(`The amount must be between ${formatGBP(MIN_AMOUNT_PENCE)} and ${formatGBP(MAX_AMOUNT_PENCE)}.`);
    }
    if (!form.description.trim()) return setError("A description is required. The client sees it on the payment page.");

    const body = {
      client: form.client,
      amountPence,
      description: form.description.trim(),
      reason: form.reason,
      ...(form.billingEmail.trim() ? { billingEmail: form.billingEmail.trim() } : {}),
    };

    setSaving(true);
    setError("");
    try {
      onCreated(await createPaymentRequest(body));
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to create the payment request."));
      setSaving(false);
    }
  };

  return (
    <BillingModal
      title="New one-off payment request"
      onClose={onClose}
      busy={saving}
      footer={
        <>
          <button type="button" className="bl-btn bl-btn--ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" form="payment-request-form" className="bl-btn bl-btn--primary" disabled={saving}>
            {saving ? "Generating link..." : "Generate & email payment link"}
          </button>
        </>
      }
    >
      <form id="payment-request-form" className="bl-form" onSubmit={handleSubmit} noValidate>
        <p className="bl-hint">
          A single payment, separate from any monthly subscription. The client gets a Stripe payment link by email.
        </p>
        {error && <p className="bl-form-error">{error}</p>}

        <div className="bl-field">
          <label htmlFor="pr-client">Client *</label>
          <ClientSelect
            id="pr-client"
            value={form.client}
            onChange={(id, client) => setForm((prev) => ({ ...prev, client: id, clientEmail: client?.email || "" }))}
            activeOnly
            required
          />
        </div>

        <div className="bl-form-grid">
          <div className="bl-field">
            <label htmlFor="pr-amount">Amount (£) *</label>
            <input id="pr-amount" inputMode="decimal" placeholder="1250.00" value={form.amount} onChange={set("amount")} required />
            {amountPence !== null && form.amount && <span className="bl-hint">Client will be charged {formatGBP(amountPence)} once.</span>}
          </div>

          <div className="bl-field">
            <label htmlFor="pr-reason">Reason</label>
            <select id="pr-reason" value={form.reason} onChange={set("reason")}>
              {Object.entries(PAYMENT_REQUEST_REASON_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bl-field">
          <label htmlFor="pr-description">Description *</label>
          <input
            id="pr-description"
            placeholder="e.g. Outstanding balance for September"
            value={form.description}
            onChange={set("description")}
            maxLength={500}
            required
          />
        </div>

        <div className="bl-field">
          <label htmlFor="pr-email">Billing email (optional)</label>
          <input
            id="pr-email"
            type="email"
            placeholder={form.clientEmail ? `Defaults to ${form.clientEmail}` : "Defaults to the client's email"}
            value={form.billingEmail}
            onChange={set("billingEmail")}
            maxLength={254}
          />
        </div>
      </form>
    </BillingModal>
  );
};

export default PaymentRequestForm;
