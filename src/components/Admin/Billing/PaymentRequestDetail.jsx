import { getPaymentRequest, getApiErrorMessage } from "../../../services/billingApi";
import {
  formatGBP,
  formatDate,
  formatDateTime,
  clientLabel,
  safeExternalUrl,
  PAYMENT_REQUEST_REASON_LABELS,
  RESENDABLE_REQUEST_STATUSES,
} from "../../../utils/billingFormat";
import { useBillingQuery } from "../../Billing/useBillingQuery";
import BillingModal from "../../Billing/BillingModal";
import StatusBadge from "../../Billing/StatusBadge";
import InvoiceLinks from "../../Billing/InvoiceLinks";
import { LoadingState, ErrorState } from "../../Billing/StateViews";

// View of one one-off payment request, freshly loaded from the backend.
// `emailSent` is passed right after create/resend to show that outcome.
const PaymentRequestDetail = ({ requestId, emailSent, refreshKey = 0, busy = false, onResend, onCancel, onClose, notify }) => {
  const { status, data: request, error, reload } = useBillingQuery(() => getPaymentRequest(requestId), `${requestId}#${refreshKey}`);
  const payUrl = request?.status === "pending" ? safeExternalUrl(request.paymentUrl) : null;
  const actionable = request && RESENDABLE_REQUEST_STATUSES.includes(request.status);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(payUrl);
      notify("success", "Payment link copied.");
    } catch {
      notify("error", "Couldn't copy the link. Select it and copy manually.");
    }
  };

  return (
    <BillingModal
      title="One-off payment request"
      onClose={onClose}
      busy={busy}
      footer={
        actionable && (
          <>
            <button type="button" className="bl-btn bl-btn--danger" onClick={() => onCancel(request)} disabled={busy}>
              Cancel request
            </button>
            <button type="button" className="bl-btn bl-btn--primary" onClick={() => onResend(request)} disabled={busy}>
              {busy ? "Sending..." : "Resend payment link"}
            </button>
          </>
        )
      }
    >
      {status === "loading" && !request && <LoadingState message="Loading payment request..." />}
      {status === "error" && <ErrorState message={getApiErrorMessage(error, "We couldn't load this request.")} onRetry={reload} />}

      {request && (
        <div className="bl-detail">
          {typeof emailSent === "boolean" && (
            <p className={`bl-alert ${emailSent ? "bl-alert--success" : "bl-alert--warning"}`}>
              {emailSent
                ? "Payment link emailed to the client."
                : "The payment link was created but the email could NOT be sent. Resend it or copy the link below."}
            </p>
          )}

          <dl className="bl-kv">
            <div>
              <dt>Client</dt>
              <dd>
                {clientLabel(request.client)}
                <span className="bl-fact-sub">{request.client?.email}</span>
              </dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>One-off payment</dd>
            </div>
            <div>
              <dt>Amount</dt>
              <dd>{formatGBP(request.amountPence)}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <StatusBadge kind="request" value={request.status} />
              </dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{request.description}</dd>
            </div>
            <div>
              <dt>Reason</dt>
              <dd>{PAYMENT_REQUEST_REASON_LABELS[request.reason] || request.reason}</dd>
            </div>
            <div>
              <dt>Billing email</dt>
              <dd>{request.billingEmail || "Client's login email"}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatDateTime(request.createdAt)}</dd>
            </div>
            <div>
              <dt>Link emailed</dt>
              <dd>{request.emailedAt ? formatDateTime(request.emailedAt) : "Not sent"}</dd>
            </div>
            <div>
              <dt>Link expires</dt>
              <dd>{formatDateTime(request.expiresAt)}</dd>
            </div>
            <div>
              <dt>Links issued</dt>
              <dd>{request.checkoutAttempts ?? "—"}</dd>
            </div>
            {request.paidAt && (
              <div>
                <dt>Paid</dt>
                <dd>{formatDateTime(request.paidAt)}</dd>
              </div>
            )}
            {request.cancelledAt && (
              <div>
                <dt>Cancelled</dt>
                <dd>{formatDateTime(request.cancelledAt)}</dd>
              </div>
            )}
          </dl>

          {request.payments?.length > 0 && (
            <div>
              <h3>Payments &amp; invoices</h3>
              <div className="bl-table-wrap">
                <table className="bl-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {request.payments.map((p) => (
                      <tr key={p._id}>
                        <td data-label="Date">{formatDate(p.paidAt || p.failedAt || p.createdAt)}</td>
                        <td data-label="Amount">{formatGBP(p.amountPence)}</td>
                        <td data-label="Status">
                          <StatusBadge kind="payment" value={p.status} />
                        </td>
                        <td data-label="Invoice">
                          <InvoiceLinks payment={p} showDetails />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {payUrl && (
            <div className="bl-copy">
              <input readOnly value={payUrl} aria-label="Payment link" onFocus={(e) => e.target.select()} />
              <button type="button" className="bl-btn bl-btn--ghost bl-btn--sm" onClick={copyLink}>
                Copy link
              </button>
            </div>
          )}
        </div>
      )}
    </BillingModal>
  );
};

export default PaymentRequestDetail;
