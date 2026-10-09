import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import { listClientPlans, getApiErrorMessage } from "../../../services/billingApi";
import {
  formatGBP,
  formatDate,
  clientLabel,
  LIVE_SUBSCRIPTION_STATUSES,
  SUBSCRIPTION_STATUS_LABELS,
  PLAN_STATUS_LABELS,
} from "../../../utils/billingFormat";
import { useBillingQuery } from "../../../components/Billing/useBillingQuery";
import StatusBadge from "../../../components/Billing/StatusBadge";
import DaysRemaining from "../../../components/Billing/DaysRemaining";
import Pagination from "../../../components/Billing/Pagination";
import { LoadingState, EmptyState, ErrorState } from "../../../components/Billing/StateViews";
import ClientSelect from "../../../components/Admin/Billing/ClientSelect";
import ClientPlanForm from "../../../components/Admin/Billing/ClientPlanForm";
import ClientPlanDetail from "../../../components/Admin/Billing/ClientPlanDetail";

const PAGE_SIZE = 20;

const ClientPlansAdmin = () => {
  const { notify } = useOutletContext();
  const [filters, setFilters] = useState({ client: "", status: "", billingStatus: "" });
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const [openPlanId, setOpenPlanId] = useState(null);

  const { status, data, error, reload } = useBillingQuery(
    () =>
      listClientPlans({
        page,
        limit: PAGE_SIZE,
        client: filters.client || undefined,
        status: filters.status || undefined,
        billingStatus: filters.billingStatus || undefined,
      }),
    JSON.stringify({ ...filters, page })
  );
  const plans = data?.items || [];

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <section className="bl-card">
      <div className="bl-card-header bl-card-header--row">
        <div>
          <h2>Custom plans</h2>
          <p>Create a plan for a client, then send the Stripe payment link to start their monthly subscription.</p>
        </div>
        <button type="button" className="bl-btn bl-btn--primary" onClick={() => setCreating(true)}>
          <FaPlus aria-hidden="true" /> Create plan
        </button>
      </div>

      <div className="bl-filters">
        <div className="bl-field">
          <label htmlFor="plans-client">Client</label>
          <ClientSelect id="plans-client" value={filters.client} onChange={(id) => setFilter("client", id)} allLabel="All clients" />
        </div>
        <div className="bl-field">
          <label htmlFor="plans-billing-status">Subscription status</label>
          <select id="plans-billing-status" value={filters.billingStatus} onChange={(e) => setFilter("billingStatus", e.target.value)}>
            <option value="">All</option>
            {Object.entries(SUBSCRIPTION_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="bl-field">
          <label htmlFor="plans-status">Plan status</label>
          <select id="plans-status" value={filters.status} onChange={(e) => setFilter("status", e.target.value)}>
            <option value="">All</option>
            {Object.entries(PLAN_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "loading" && <LoadingState message="Loading plans..." />}
      {status === "error" && <ErrorState message={getApiErrorMessage(error, "We couldn't load client plans.")} onRetry={reload} />}
      {status === "success" && plans.length === 0 && (
        <EmptyState
          title="No plans found"
          message={
            Object.values(filters).some(Boolean)
              ? "No plans match these filters."
              : "Create a custom plan for a client to get started."
          }
        />
      )}

      {status === "success" && plans.length > 0 && (
        <div className="bl-table-wrap">
          <table className="bl-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Plan</th>
                <th>Monthly</th>
                <th>Subscription</th>
                <th>Start date</th>
                <th>Period ends</th>
                <th>Next payment</th>
                <th>Days left</th>
                <th>Last payment</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => {
                const billing = plan.billing || {};
                const isLive = LIVE_SUBSCRIPTION_STATUSES.includes(billing.status);
                return (
                  <tr key={plan._id}>
                    <td data-label="Client">
                      <strong>{clientLabel(plan.client)}</strong>
                      <span className="bl-fact-sub">{plan.client?.email}</span>
                    </td>
                    <td data-label="Plan">
                      {plan.name}
                      <span className="bl-fact-sub">
                        <StatusBadge kind="plan" value={plan.status} />
                      </span>
                    </td>
                    <td data-label="Monthly">{formatGBP(plan.amountPence)}</td>
                    <td data-label="Subscription">
                      {billing.state ? (
                        <StatusBadge kind="state" value={billing.state} />
                      ) : (
                        <StatusBadge kind="subscription" value={billing.status} />
                      )}
                      {billing.cancelAtPeriodEnd && <span className="bl-fact-sub">Cancels at period end</span>}
                    </td>
                    <td data-label="Start date">{formatDate(plan.startDate)}</td>
                    <td data-label="Period ends">{isLive ? formatDate(billing.currentPeriodEnd) : "—"}</td>
                    <td data-label="Next payment">{billing.cancelAtPeriodEnd ? "—" : formatDate(billing.nextPaymentDate)}</td>
                    <td data-label="Days left">{isLive ? <DaysRemaining until={billing.currentPeriodEnd} /> : "—"}</td>
                    <td data-label="Last payment">
                      <StatusBadge kind="lastPayment" value={billing.lastPaymentStatus} />
                    </td>
                    <td data-label="Actions">
                      <button type="button" className="bl-btn bl-btn--ghost bl-btn--sm" onClick={() => setOpenPlanId(plan._id)}>
                        Manage
                      </button>
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
        <ClientPlanForm
          onClose={() => setCreating(false)}
          onSaved={(plan) => {
            setCreating(false);
            notify("success", `Plan "${plan.name}" created. Open it to send the payment link.`);
            reload();
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

export default ClientPlansAdmin;
