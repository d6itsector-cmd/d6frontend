import { useState } from "react";

import { listPayments, getApiErrorMessage } from "../../../services/billingApi";
import {
  formatGBP,
  formatDate,
  formatPeriod,
  clientLabel,
  paymentDescription,
  PAYMENT_SOURCE_LABELS,
  PAYMENT_STATUS_LABELS,
} from "../../../utils/billingFormat";
import { useBillingQuery } from "../../../components/Billing/useBillingQuery";
import StatusBadge from "../../../components/Billing/StatusBadge";
import InvoiceLinks from "../../../components/Billing/InvoiceLinks";
import Pagination from "../../../components/Billing/Pagination";
import { LoadingState, EmptyState, ErrorState } from "../../../components/Billing/StateViews";
import ClientSelect from "../../../components/Admin/Billing/ClientSelect";

const PAGE_SIZE = 25;

// Read-only: payments are written only by the backend's Stripe webhook sync.
const PaymentsAdmin = () => {
  const [filters, setFilters] = useState({ client: "", source: "", status: "" });
  const [page, setPage] = useState(1);

  const { status, data, error, reload } = useBillingQuery(
    () =>
      listPayments({
        page,
        limit: PAGE_SIZE,
        client: filters.client || undefined,
        source: filters.source || undefined,
        status: filters.status || undefined,
      }),
    JSON.stringify({ ...filters, page })
  );
  const payments = data?.items || [];

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <section className="bl-card">
      <div className="bl-card-header">
        <h2>Payment history</h2>
        <p>Every subscription charge and one-off payment recorded by Stripe.</p>
      </div>

      <div className="bl-filters">
        <div className="bl-field">
          <label htmlFor="pay-client">Client</label>
          <ClientSelect id="pay-client" value={filters.client} onChange={(id) => setFilter("client", id)} allLabel="All clients" />
        </div>
        <div className="bl-field">
          <label htmlFor="pay-source">Source</label>
          <select id="pay-source" value={filters.source} onChange={(e) => setFilter("source", e.target.value)}>
            <option value="">All</option>
            {Object.entries(PAYMENT_SOURCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="bl-field">
          <label htmlFor="pay-status">Status</label>
          <select id="pay-status" value={filters.status} onChange={(e) => setFilter("status", e.target.value)}>
            <option value="">All</option>
            {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "loading" && <LoadingState message="Loading payments..." />}
      {status === "error" && <ErrorState message={getApiErrorMessage(error, "We couldn't load payments.")} onRetry={reload} />}
      {status === "success" && payments.length === 0 && (
        <EmptyState
          title="No payments"
          message={Object.values(filters).some(Boolean) ? "No payments match these filters." : "Payments appear here once Stripe records them."}
        />
      )}

      {status === "success" && payments.length > 0 && (
        <div className="bl-table-wrap">
          <table className="bl-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Source</th>
                <th>Status</th>
                <th>Billing period</th>
                <th>Invoice / receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td data-label="Date">{formatDate(p.paidAt || p.failedAt || p.createdAt)}</td>
                  <td data-label="Client">
                    <strong>{clientLabel(p.client)}</strong>
                    <span className="bl-fact-sub">{p.client?.email}</span>
                  </td>
                  <td data-label="Description">
                    {paymentDescription(p)}
                    {p.failureMessage && <span className="bl-fact-sub bl-text-danger">{p.failureMessage}</span>}
                  </td>
                  <td data-label="Amount">{formatGBP(p.amountPence)}</td>
                  <td data-label="Source">
                    <StatusBadge kind="source" value={p.source} />
                  </td>
                  <td data-label="Status">
                    <StatusBadge kind="payment" value={p.status} />
                  </td>
                  <td data-label="Billing period">{p.source === "subscription" ? formatPeriod(p.periodStart, p.periodEnd) : "—"}</td>
                  <td data-label="Invoice / receipt">
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

export default PaymentsAdmin;
