import { getPayment, getApiErrorMessage } from "../../../services/billingApi";
import {
  formatGBP,
  formatDateTime,
  formatPeriod,
  clientLabel,
  paymentDescription,
  PAYMENT_REQUEST_REASON_LABELS,
} from "../../../utils/billingFormat";
import { useBillingQuery } from "../../Billing/useBillingQuery";
import BillingModal from "../../Billing/BillingModal";
import StatusBadge from "../../Billing/StatusBadge";
import InvoiceLinks from "../../Billing/InvoiceLinks";
import { LoadingState, ErrorState } from "../../Billing/StateViews";

// Read-only admin view of one Payment (GET /api/admin/payments/:id). Payments
// are written only by the backend's Stripe webhook sync.
const PaymentDetail = ({ paymentId, onClose }) => {
  const { status, data: p, error, reload } = useBillingQuery(() => getPayment(paymentId), paymentId);

  const rows = p
    ? [
        ["Client", <>{clientLabel(p.client)}<span className="bl-fact-sub">{p.client?.email}</span></>],
        ["Description", paymentDescription(p)],
        ["Source", <StatusBadge kind="source" value={p.source} />],
        ["Amount", formatGBP(p.amountPence)],
        ["Status", <StatusBadge kind="payment" value={p.status} />],
        p.source === "subscription" && ["Billing period", formatPeriod(p.periodStart, p.periodEnd)],
        p.source === "payment_request" &&
          p.paymentRequest?.reason && ["Reason", PAYMENT_REQUEST_REASON_LABELS[p.paymentRequest.reason] || p.paymentRequest.reason],
        p.paidAt && ["Paid", formatDateTime(p.paidAt)],
        p.failedAt && ["Failed", formatDateTime(p.failedAt)],
        p.failureMessage && ["Failure reason", <span className="bl-text-danger">{p.failureMessage}</span>],
        ["Recorded", formatDateTime(p.createdAt)],
        ["Invoice", <InvoiceLinks payment={p} showDetails />],
        p.stripePaymentIntentId && ["Stripe payment intent", <code>{p.stripePaymentIntentId}</code>],
        p.invoice?.id && ["Stripe invoice", <code>{p.invoice.id}</code>],
      ].filter(Boolean)
    : [];

  return (
    <BillingModal title="Payment" onClose={onClose}>
      {status === "loading" && !p && <LoadingState message="Loading payment..." />}
      {status === "error" && <ErrorState message={getApiErrorMessage(error, "We couldn't load this payment.")} onRetry={reload} />}
      {p && (
        <dl className="bl-kv">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </BillingModal>
  );
};

export default PaymentDetail;
