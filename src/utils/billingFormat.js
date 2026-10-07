// Formatting + label helpers shared by the client and admin billing screens.
// Display only: none of these derive billing state -- status, period dates
// and next payment always come from the backend (Stripe webhook sync).

// Same timezone the backend uses for reminder days (BILLING_TIMEZONE), so
// "days remaining" here matches the 7/2/1-day reminder emails.
export const BILLING_TIMEZONE = "Europe/London";

// Stripe's GBP limits, mirrored from the backend validator.
export const MIN_AMOUNT_PENCE = 30;
export const MAX_AMOUNT_PENCE = 99_999_999;

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

export const formatGBP = (pence) =>
  typeof pence === "number" && Number.isFinite(pence) ? gbp.format(pence / 100) : "—";

// "£1,250.50" / "1250.5" / "49" -> integer pence. Parsed from the string
// (not via float maths) so 0.1 + 0.2 style errors can't bill the wrong
// amount. Returns null for anything that isn't a valid £ amount with at
// most 2 decimal places.
export const poundsToPence = (input) => {
  const cleaned = String(input ?? "").replace(/[£,\s]/g, "");
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(cleaned);
  if (!match) return null;
  const pounds = Number(match[1]);
  const pence = Number((match[2] || "").padEnd(2, "0"));
  const total = pounds * 100 + pence;
  return Number.isSafeInteger(total) ? total : null;
};

export const penceToPoundsInput = (pence) =>
  typeof pence === "number" ? (pence / 100).toFixed(2) : "";

const toDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const formatDate = (value, fallback = "—") => {
  const d = toDate(value);
  return d
    ? d.toLocaleDateString("en-GB", { timeZone: BILLING_TIMEZONE, day: "2-digit", month: "short", year: "numeric" })
    : fallback;
};

export const formatDateTime = (value, fallback = "—") => {
  const d = toDate(value);
  return d
    ? d.toLocaleString("en-GB", {
        timeZone: BILLING_TIMEZONE,
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : fallback;
};

export const formatPeriod = (start, end) => {
  if (!start && !end) return "—";
  return `${formatDate(start)} – ${formatDate(end)}`;
};

// yyyy-mm-dd for <input type="date">, read in the billing timezone.
export const toDateInputValue = (value) => {
  const d = toDate(value);
  if (!d) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: BILLING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (type) => parts.find((p) => p.type === type).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
};

const ymdInZone = (date) => {
  const [y, m, d] = toDateInputValue(date).split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};

// Whole calendar days from today to `value` on a Europe/London wall calendar
// (same rule as the backend's calendarDaysUntil). null when no date.
export const daysUntil = (value, now = new Date()) => {
  const d = toDate(value);
  if (!d) return null;
  return Math.round((ymdInZone(d) - ymdInZone(now)) / 86_400_000);
};

export const clientLabel = (client) => {
  if (!client || typeof client !== "object") return "—";
  const name = client.displayName || client.email;
  const company = client.profile?.companyName;
  return company ? `${name} (${company})` : name;
};

export const paymentDescription = (p) =>
  p.description || p.plan?.name || p.paymentRequest?.description || "Payment";

// Only http(s) links from the backend are rendered as hrefs.
export const safeExternalUrl = (url) => (typeof url === "string" && /^https?:\/\//i.test(url) ? url : null);

// ---------------- Labels ----------------

export const SUBSCRIPTION_STATUS_LABELS = {
  none: "Not started",
  pending_checkout: "Awaiting first payment",
  checkout_expired: "Payment link expired",
  setup_failed: "Setup failed",
  incomplete: "Incomplete",
  incomplete_expired: "Expired",
  trialing: "Trial",
  active: "Active",
  past_due: "Past due",
  unpaid: "Unpaid",
  paused: "Paused",
  canceled: "Cancelled",
};

export const PLAN_STATUS_LABELS = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  ended: "Ended",
};

export const LAST_PAYMENT_STATUS_LABELS = {
  none: "No payments yet",
  succeeded: "Paid",
  failed: "Failed",
  requires_action: "Action required",
};

export const PAYMENT_STATUS_LABELS = {
  succeeded: "Paid",
  failed: "Failed",
  requires_action: "Action required",
  processing: "Processing",
};

export const PAYMENT_REQUEST_STATUS_LABELS = {
  pending: "Awaiting payment",
  processing: "Processing",
  paid: "Paid",
  failed: "Failed",
  expired: "Link expired",
  cancelled: "Cancelled",
  setup_failed: "Setup failed",
};

export const PAYMENT_REQUEST_REASON_LABELS = {
  previous_unpaid: "Previous unpaid amount",
  outstanding_balance: "Outstanding balance",
  additional_service: "Additional service",
  one_time: "One-time charge",
  manual: "Manual request",
};

export const PAYMENT_SOURCE_LABELS = {
  subscription: "Monthly subscription",
  payment_request: "One-off payment",
};

// Subscription statuses that still "hold" the plan (mirrors the backend's
// OPEN_SUBSCRIPTION_STATUSES) -- used only to decide which admin actions to
// offer; the backend re-checks and answers 409 if the UI is stale.
export const OPEN_SUBSCRIPTION_STATUSES = [
  "pending_checkout",
  "checkout_expired",
  "incomplete",
  "trialing",
  "active",
  "past_due",
  "unpaid",
  "paused",
];

export const LINK_PENDING_STATUSES = ["pending_checkout", "checkout_expired"];

// Statuses with a real Stripe billing period (period dates are meaningful).
export const LIVE_SUBSCRIPTION_STATUSES = ["trialing", "active", "past_due", "unpaid", "paused"];

export const RESENDABLE_REQUEST_STATUSES = ["pending", "failed", "expired"];
