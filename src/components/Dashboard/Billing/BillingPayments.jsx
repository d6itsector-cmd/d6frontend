import "../../Billing/Billing.css";

import { useState } from "react";

import { getMyPayments, getMyPaymentRequests, getApiErrorMessage } from "../../../services/billingApi";
import {
  formatGBP,
  formatDate,
  formatDateTime,
  formatPeriod,
  safeExternalUrl,
  paymentDescription,
  PAYMENT_REQUEST_REASON_LABELS,
} from "../../../utils/billingFormat";
import { useBillingQuery } from "../../Billing/useBillingQuery";
import { useRefreshOnReturn } from "../../Billing/useRefreshOnReturn";
import StatusBadge from "../../Billing/StatusBadge";
import InvoiceLinks from "../../Billing/InvoiceLinks";
import Pagination from "../../Billing/Pagination";
import { LoadingState, EmptyState, ErrorState } from "../../Billing/StateViews";
import ManagePaymentMethodButton from "./ManagePaymentMethodButton";

const PAGE_SIZE = 10;

// Client billing area: one-off payment requests (with Pay Now while the
// backend still offers a link) and the Stripe-synced payment history.
const BillingPayments = () => (
  <div className="bl-page">
    <div className="bl-page-header">
      <div>
        <h1>Billing</h1>
        <p>Outstanding payments, payment history and invoices.</p>
      </div>
      <ManagePaymentMethodButton />
    </div>

    <PaymentRequestsSection />
    <PaymentHistorySection />
  </div>
);

const PaymentRequestsSection = () => {
  const [page, setPage] = useState(1);
  const { status, data, error, reload } = useBillingQuery(
    () => getMyPaymentRequests({ page, limit: PAGE_SIZE }),
    `requests-${page}`
  );
  const items = data?.items || [];
  // Background refreshes (returning from Stripe) keep the table on screen.
  useRefreshOnReturn(reload);
  const loaded = Boolean(data) && status !== "error";

  return (
    <section className="bl-card">
      <div className="bl-card-header">
        <h2>Payment requests</h2>
        <p>One-off payments requested by your account team. These are separate from your monthly plan.</p>
      </div>

      {status === "loading" && !data && <LoadingState message="Loading payment requests..." />}
      {status === "error" && (
        <ErrorState message={getApiErrorMessage(error, "We couldn't load your payment requests.")} onRetry={reload} />
      )}
      {loaded && items.length === 0 && <EmptyState message="You have no payment requests." />}

      {loaded && items.length > 0 && (
        <div className="bl-table-wrap">
          <table className="bl-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Requested</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {items.map((r) => {
                const payUrl = safeExternalUrl(r.paymentUrl);
                return (
                  <tr key={r._id}>
                    <td data-label="Description">
                      <strong>{r.description}</strong>
                      {r.reason && <span className="bl-fact-sub">{PAYMENT_REQUEST_REASON_LABELS[r.reason] || r.reason}</span>}
                    </td>
                    <td data-label="Type">One-off payment</td>
                    <td data-label="Amount">{formatGBP(r.amountPence)}</td>
                    <td data-label="Status">
                      {r.state ? <StatusBadge kind="state" value={r.state} /> : <StatusBadge kind="request" value={r.status} />}
                      {r.status === "paid" && r.paidAt && <span className="bl-fact-sub">{formatDate(r.paidAt)}</span>}
                      {r.status === "cancelled" && r.cancelledAt && (
                        <span className="bl-fact-sub">{formatDate(r.cancelledAt)} · no payment taken</span>
                      )}
                    </td>
                    <td data-label="Requested">{formatDate(r.createdAt)}</td>
                    <td data-label="Action">
                      {payUrl ? (
                        <div className="bl-pay">
                          <a className="bl-btn bl-btn--primary bl-btn--sm" href={payUrl}>
                            Pay Now
                          </a>
                          {r.expiresAt && <span className="bl-fact-sub">Link expires {formatDateTime(r.expiresAt)}</span>}
                        </div>
                      ) : ["pending", "expired", "failed"].includes(r.status) ? (
                        <span className="bl-fact-sub">Contact your account team for a new payment link.</span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pagination={data?.pagination} onPageChange={setPage} disabled={status === "loading"} />
    </section>
  );
};

const PaymentHistorySection = () => {
  const [page, setPage] = useState(1);
  const { status, data, error, reload } = useBillingQuery(
    () => getMyPayments({ page, limit: PAGE_SIZE }),
    `payments-${page}`
  );
  const items = data?.items || [];

  return (
    <section className="bl-card">
      <div className="bl-card-header">
        <h2>Payment history</h2>
        <p>Payments recorded by Stripe for your subscription and one-off requests.</p>
      </div>

      {status === "loading" && <LoadingState message="Loading payment history..." />}
      {status === "error" && (
        <ErrorState message={getApiErrorMessage(error, "We couldn't load your payment history.")} onRetry={reload} />
      )}
      {status === "success" && items.length === 0 && <EmptyState message="No payments have been made yet." />}

      {status === "success" && items.length > 0 && (
        <div className="bl-table-wrap">
          <table className="bl-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Billing period</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id}>
                  <td data-label="Date">{formatDate(p.paidAt || p.failedAt || p.createdAt)}</td>
                  <td data-label="Description">{paymentDescription(p)}</td>
                  <td data-label="Type">
                    <StatusBadge kind="source" value={p.source} />
                  </td>
                  <td data-label="Amount">{formatGBP(p.amountPence)}</td>
                  <td data-label="Status">
                    <StatusBadge kind="payment" value={p.status} />
                  </td>
                  <td data-label="Billing period">
                    {p.source === "subscription" ? formatPeriod(p.periodStart, p.periodEnd) : "—"}
                  </td>
                  <td data-label="Invoice">
                    <InvoiceLinks payment={p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pagination={data?.pagination} onPageChange={setPage} disabled={status === "loading"} />
    </section>
  );
};

export default BillingPayments;
