import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import {
  listPaymentRequests,
  resendPaymentRequest,
  cancelPaymentRequest,
  getApiErrorMessage,
} from "../../../services/billingApi";
import {
  formatGBP,
  formatDate,
  formatDateTime,
  clientLabel,
  PAYMENT_REQUEST_REASON_LABELS,
  PAYMENT_REQUEST_STATUS_LABELS,
  RESENDABLE_REQUEST_STATUSES,
  emailFailureText,
} from "../../../utils/billingFormat";
import { useBillingQuery } from "../../../components/Billing/useBillingQuery";
import StatusBadge from "../../../components/Billing/StatusBadge";
import Pagination from "../../../components/Billing/Pagination";
import ConfirmationModal from "../../../components/Billing/ConfirmationModal";
import { LoadingState, EmptyState, ErrorState } from "../../../components/Billing/StateViews";
import ClientSelect from "../../../components/Admin/Billing/ClientSelect";
import PaymentRequestForm from "../../../components/Admin/Billing/PaymentRequestForm";
import PaymentRequestDetail from "../../../components/Admin/Billing/PaymentRequestDetail";

const PAGE_SIZE = 20;

const PaymentRequestsAdmin = () => {
  const { notify } = useOutletContext();
  const [filters, setFilters] = useState({ client: "", status: "" });
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const [detail, setDetail] = useState(null); // { id, emailSent? }
  const [detailVersion, setDetailVersion] = useState(0);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelError, setCancelError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const { status, data, error, reload } = useBillingQuery(
    () =>
      listPaymentRequests({
        page,
        limit: PAGE_SIZE,
        client: filters.client || undefined,
        status: filters.status || undefined,
      }),
    JSON.stringify({ ...filters, page })
  );
  const requests = data?.items || [];

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const afterChange = () => {
    reload();
    setDetailVersion((v) => v + 1);
  };

  const handleResend = async (request) => {
    setBusyId(request._id);
    try {
      const { emailSent } = await resendPaymentRequest(request._id);
      notify(
        emailSent ? "success" : "warning",
        emailSent ? "Payment link re-sent to the client." : "A fresh link was issued, but the email could NOT be sent. Copy the link from the request."
      );
      if (detail?.id === request._id) setDetail({ id: request._id, emailSent });
      afterChange();
    } catch (err) {
      notify("error", getApiErrorMessage(err, "Unable to resend this payment request."));
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async () => {
    setBusyId(cancelTarget._id);
    setCancelError("");
    try {
      const { paymentRequest, emailSent, email } = await cancelPaymentRequest(cancelTarget._id);
      notify(
        emailSent === false ? "warning" : "success",
        `Payment request ${PAYMENT_REQUEST_STATUS_LABELS[paymentRequest?.status]?.toLowerCase() || "cancelled"}. The link no longer works.${
          emailSent === false ? ` ${emailFailureText(email)}` : emailSent ? " The client was emailed." : ""
        }`
      );
      setCancelTarget(null);
      afterChange();
    } catch (err) {
      setCancelError(getApiErrorMessage(err, "Unable to cancel this payment request."));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="bl-card">
      <div className="bl-card-header bl-card-header--row">
        <div>
          <h2>One-off payment requests</h2>
          <p>Single payments for outstanding balances or extra work. These never create a subscription.</p>
        </div>
        <button type="button" className="bl-btn bl-btn--primary" onClick={() => setCreating(true)}>
          <FaPlus aria-hidden="true" /> New payment request
        </button>
      </div>

      <div className="bl-filters">
        <div className="bl-field">
          <label htmlFor="pr-filter-client">Client</label>
          <ClientSelect id="pr-filter-client" value={filters.client} onChange={(id) => setFilter("client", id)} allLabel="All clients" />
        </div>
        <div className="bl-field">
          <label htmlFor="pr-filter-status">Status</label>
          <select id="pr-filter-status" value={filters.status} onChange={(e) => setFilter("status", e.target.value)}>
            <option value="">All</option>
            {Object.entries(PAYMENT_REQUEST_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "loading" && <LoadingState message="Loading payment requests..." />}
      {status === "error" && <ErrorState message={getApiErrorMessage(error, "We couldn't load payment requests.")} onRetry={reload} />}
      {status === "success" && requests.length === 0 && (
        <EmptyState
          title="No payment requests"
          message={Object.values(filters).some(Boolean) ? "No requests match these filters." : "Create one to send a client a one-off payment link."}
        />
      )}

      {status === "success" && requests.length > 0 && (
        <div className="bl-table-wrap">
          <table className="bl-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Link expires</th>
                <th>Emailed</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => {
                const actionable = RESENDABLE_REQUEST_STATUSES.includes(r.status);
                return (
                  <tr key={r._id}>
                    <td data-label="Client">
                      <strong>{clientLabel(r.client)}</strong>
                      <span className="bl-fact-sub">{r.client?.email}</span>
                    </td>
                    <td data-label="Description">
                      {r.description}
                      <span className="bl-fact-sub">{PAYMENT_REQUEST_REASON_LABELS[r.reason] || r.reason}</span>
                    </td>
                    <td data-label="Amount">{formatGBP(r.amountPence)}</td>
                    <td data-label="Status">
                      <StatusBadge kind="request" value={r.status} />
                    </td>
                    <td data-label="Created">{formatDate(r.createdAt)}</td>
                    <td data-label="Link expires">{r.status === "pending" ? formatDateTime(r.expiresAt) : "—"}</td>
                    <td data-label="Emailed">{r.emailedAt ? formatDate(r.emailedAt) : "No"}</td>
                    <td data-label="Actions">
                      <div className="bl-actions">
                        <button type="button" className="bl-btn bl-btn--ghost bl-btn--sm" onClick={() => setDetail({ id: r._id })}>
                          View
                        </button>
                        {actionable && (
                          <>
                            <button
                              type="button"
                              className="bl-btn bl-btn--ghost bl-btn--sm"
                              onClick={() => handleResend(r)}
                              disabled={busyId === r._id}
                            >
                              {busyId === r._id ? "Sending..." : "Resend"}
                            </button>
                            <button
                              type="button"
                              className="bl-btn bl-btn--danger-ghost bl-btn--sm"
                              onClick={() => {
                                setCancelError("");
                                setCancelTarget(r);
                              }}
                              disabled={busyId === r._id}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pagination={data?.pagination} onPageChange={setPage} disabled={status === "loading"} />

      {creating && (
        <PaymentRequestForm
          onClose={() => setCreating(false)}
          onCreated={({ paymentRequest, emailSent }) => {
            setCreating(false);
            notify(
              emailSent ? "success" : "warning",
              emailSent
                ? `Payment link for ${formatGBP(paymentRequest.amountPence)} emailed to the client.`
                : "Payment request created, but the email could NOT be sent. Copy the link from the request."
            );
            reload();
            setDetail({ id: paymentRequest._id, emailSent });
          }}
        />
      )}

      {detail && !cancelTarget && (
        <PaymentRequestDetail
          requestId={detail.id}
          emailSent={detail.emailSent}
          refreshKey={detailVersion}
          busy={busyId === detail.id}
          onResend={handleResend}
          onCancel={(r) => {
            setCancelError("");
            setCancelTarget(r);
          }}
          onClose={() => setDetail(null)}
          notify={notify}
        />
      )}

      {cancelTarget && (
        <ConfirmationModal
          title="Cancel this payment request?"
          message={`The ${formatGBP(cancelTarget.amountPence)} payment link for "${cancelTarget.description}" will stop working. This can't be undone; create a new request if needed.`}
          confirmLabel="Cancel request"
          cancelLabel="Keep request"
          danger
          busy={busyId === cancelTarget._id}
          error={cancelError}
          onConfirm={handleCancel}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </section>
  );
};

export default PaymentRequestsAdmin;
