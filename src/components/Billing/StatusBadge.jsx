import {
  SUBSCRIPTION_STATUS_LABELS,
  PLAN_STATUS_LABELS,
  LAST_PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_REQUEST_STATUS_LABELS,
  PAYMENT_SOURCE_LABELS,
  INVOICE_STATUS_LABELS,
} from "../../utils/billingFormat";

const LABELS = {
  subscription: SUBSCRIPTION_STATUS_LABELS,
  plan: PLAN_STATUS_LABELS,
  lastPayment: LAST_PAYMENT_STATUS_LABELS,
  payment: PAYMENT_STATUS_LABELS,
  request: PAYMENT_REQUEST_STATUS_LABELS,
  source: PAYMENT_SOURCE_LABELS,
  invoice: INVOICE_STATUS_LABELS,
};

// One colour scale across every billing status family.
const TONES = {
  success: ["active", "trialing", "succeeded", "paid"],
  warning: ["pending_checkout", "incomplete", "past_due", "requires_action", "processing", "pending", "open"],
  danger: ["setup_failed", "unpaid", "failed", "incomplete_expired", "uncollectible"],
  info: ["paused", "subscription", "payment_request"],
};

const toneFor = (value) =>
  Object.keys(TONES).find((tone) => TONES[tone].includes(value)) || "muted";

/**
 * @param {{ kind: keyof typeof LABELS, value?: string }} props
 */
const StatusBadge = ({ kind, value }) => {
  const key = value || "none";
  const label = LABELS[kind]?.[key] || key.replace(/_/g, " ");

  return <span className={`bl-badge bl-badge--${toneFor(key)}`}>{label}</span>;
};

export default StatusBadge;
