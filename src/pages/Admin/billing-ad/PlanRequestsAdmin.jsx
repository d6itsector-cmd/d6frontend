import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import { listPlanRequests, rejectPlanRequest, getApiErrorMessage } from "../../../services/billingApi";
import { formatGBP, formatDate, clientLabel, PLAN_REQUEST_STATUS_LABELS } from "../../../utils/billingFormat";
import { useBillingQuery } from "../../../components/Billing/useBillingQuery";
import StatusBadge from "../../../components/Billing/StatusBadge";
import Pagination from "../../../components/Billing/Pagination";
import ConfirmationModal from "../../../components/Billing/ConfirmationModal";
import { FieldError, RequiredMark } from "../../../components/Billing/FieldBits";
import { LoadingState, EmptyState, ErrorState } from "../../../components/Billing/StateViews";
import ClientSelect from "../../../components/Admin/Billing/ClientSelect";
import ClientPlanForm from "../../../components/Admin/Billing/ClientPlanForm";
import ClientPlanDetail from "../../../components/Admin/Billing/ClientPlanDetail";
import PlanRequestDetail from "../../../components/Admin/Billing/PlanRequestDetail";

const PAGE_SIZE = 20;

// Plan-form fields prefilled from a request. The amount is left for the
// admin: a preferred budget is a hint, not necessarily a monthly price.
const planPrefill = (request) => {
  const description = [request.requirements, request.additionalDetails && `Additional details:\n${request.additionalDetails}`]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 5000);
  return {
    name: request.serviceName,
    description,
    servicesIncluded: request.service?._id
      ? [{ service: request.service._id, clientService: "", label: request.serviceName, description: "" }]
      : [],
    adminNotes: request.preferredBudgetPence ? `Client's preferred budget: ${formatGBP(request.preferredBudgetPence)}` : "",
  };
};

const PlanRequestsAdmin = () => {
  const { notify } = useOutletContext();
  const [filters, setFilters] = useState({ client: "", status: "pending" });
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState(null);
  const [detailVersion, setDetailVersion] = useState(0);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [reason, setReason] = useState("");
  const [rejectError, setRejectError] = useState(null); // { message, field? }
  const [rejecting, setRejecting] = useState(false);
  const [planFrom, setPlanFrom] = useState(null); // request being turned into a plan
  const [openPlanId, setOpenPlanId] = useState(null);

  const { status, data, error, reload } = useBillingQuery(
    () =>
      listPlanRequests({
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

  const startReject = (request) => {
    setReason("");
    setRejectError(null);
    setRejectTarget(request);
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      setRejectError({ message: "Give the client a short reason.", field: "reason" });
      document.getElementById("reject-reason")?.focus();
      return;
    }
    setRejecting(true);
    setRejectError(null);
    try {
      await rejectPlanRequest(rejectTarget._id, reason.trim());
      notify("success", `Request for ${rejectTarget.serviceName} rejected. The client can see the reason in My Plan.`);
      setRejectTarget(null);
      afterChange();
    } catch (err) {
      setRejectError({ message: getApiErrorMessage(err, "Unable to reject this request.") });
    } finally {
      setRejecting(false);
    }
  };

  return (
    <section className="bl-card">
      <div className="bl-card-header">
        <h2>Plan requests</h2>
        <p>Clients asking for a plan. Create a plan from a request to send them the usual Stripe payment link.</p>
      </div>

      <div className="bl-filters">
        <div className="bl-field">
          <label htmlFor="plr-filter-client">Client</label>
          <ClientSelect id="plr-filter-client" value={filters.client} onChange={(id) => setFilter("client", id)} allLabel="All clients" />
        </div>
        <div className="bl-field">
          <label htmlFor="plr-filter-status">Status</label>
          <select id="plr-filter-status" value={filters.status} onChange={(e) => setFilter("status", e.target.value)}>
            <option value="">All</option>
            {Object.entries(PLAN_REQUEST_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "loading" && <LoadingState message="Loading plan requests..." />}
      {status === "error" && <ErrorState message={getApiErrorMessage(error, "We couldn't load plan requests.")} onRetry={reload} />}
      {status === "success" && requests.length === 0 && (
        <EmptyState
          title="No plan requests"
          message={
            filters.status === "pending" && !filters.client
              ? "Nothing waiting for review. New requests from clients' My Plan page will appear here."
              : "No requests match these filters."
          }
        />
      )}

      {status === "success" && requests.length > 0 && (
        <div className="bl-table-wrap">
          <table className="bl-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Request</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Submitted</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td data-label="Client">
                    <strong>{clientLabel(r.client)}</strong>
                    <span className="bl-fact-sub">{r.client?.email}</span>
                  </td>
                  <td data-label="Request">{r.serviceName}</td>
                  <td data-label="Budget">{r.preferredBudgetPence ? formatGBP(r.preferredBudgetPence) : "—"}</td>
                  <td data-label="Status">
                    <StatusBadge kind="planRequest" value={r.status} />
                  </td>
                  <td data-label="Submitted">{formatDate(r.createdAt)}</td>
                  <td data-label="Actions">
                    <div className="bl-actions">
                      <button type="button" className="bl-btn bl-btn--ghost bl-btn--sm" onClick={() => setDetailId(r._id)}>
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pagination={data?.pagination} onPageChange={setPage} disabled={status === "loading"} />

      {detailId && !rejectTarget && !planFrom && !openPlanId && (
        <PlanRequestDetail
          requestId={detailId}
          refreshKey={detailVersion}
          onReject={startReject}
          onCreatePlan={setPlanFrom}
          onOpenPlan={setOpenPlanId}
          onClose={() => setDetailId(null)}
        />
      )}

      {rejectTarget && (
        <ConfirmationModal
          title="Reject Plan Request?"
          message={`${clientLabel(rejectTarget.client)} will see that their request for ${rejectTarget.serviceName} was not approved, with your reason. They can send a new request.`}
          confirmLabel="Reject Request"
          cancelLabel="Cancel"
          danger
          busy={rejecting}
          error={rejectError && !rejectError.field ? rejectError.message : ""}
          onConfirm={handleReject}
          onClose={() => setRejectTarget(null)}
        >
          <div className="bl-field">
            <label htmlFor="reject-reason">
              Reason <RequiredMark />
            </label>
            <textarea
              id="reject-reason"
              rows={3}
              maxLength={500}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (rejectError?.field) setRejectError(null);
              }}
              aria-required="true"
              aria-invalid={Boolean(rejectError?.field) || undefined}
              aria-describedby={rejectError?.field ? "reject-reason-error" : undefined}
            />
            <FieldError id="reject-reason-error" message={rejectError?.field ? rejectError.message : ""} />
          </div>
        </ConfirmationModal>
      )}

      {planFrom && (
        <ClientPlanForm
          planRequest={planFrom}
          initial={planPrefill(planFrom)}
          onClose={() => setPlanFrom(null)}
          onSaved={(plan) => {
            setPlanFrom(null);
            setDetailId(null);
            notify("success", `Plan "${plan.name}" created from the request. Send the payment link from the plan to start billing.`);
            afterChange();
            setOpenPlanId(plan._id);
          }}
        />
      )}

      {openPlanId && (
        <ClientPlanDetail planId={openPlanId} onClose={() => setOpenPlanId(null)} onChanged={reload} notify={notify} />
      )}
    </section>
  );
};

export default PlanRequestsAdmin;
