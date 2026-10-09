import "../../Billing/Billing.css";

import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

import { getMyPlans, getMyPlanRequests, cancelMyPlanRequest, getApiErrorMessage } from "../../../services/billingApi";
import {
  formatGBP,
  formatDate,
  formatDateTime,
  formatPeriod,
  safeExternalUrl,
  planState,
  LIVE_SUBSCRIPTION_STATUSES,
  PLAN_STATUS_LABELS,
} from "../../../utils/billingFormat";
import { useBillingQuery } from "../../Billing/useBillingQuery";
import { useRefreshOnReturn } from "../../Billing/useRefreshOnReturn";
import StatusBadge from "../../Billing/StatusBadge";
import DaysRemaining from "../../Billing/DaysRemaining";
import ConfirmationModal from "../../Billing/ConfirmationModal";
import { LoadingState, EmptyState, ErrorState } from "../../Billing/StateViews";
import ManagePaymentMethodButton from "./ManagePaymentMethodButton";
import RequestPlanModal from "./RequestPlanModal";

// Plans are the source of truth; plan requests only matter while the client
// has no visible plan. A failing requests call must never hide the plans.
const loadMyPlanPage = async () => {
  const [plans, requests] = await Promise.all([getMyPlans(), getMyPlanRequests().catch(() => [])]);
  return { plans, requests };
};

// Read-only view of the admin-authored plan + Stripe-synced billing state
// (GET /api/my-plan). Nothing here is editable by the client. With no plan,
// the client can ask for one (a plan request, reviewed by an admin).
const MyPlan = ({ setActivePage }) => {
  const { status, data, error, reload } = useBillingQuery(loadMyPlanPage);
  const plans = data?.plans || [];
  // Re-read when the client returns from Stripe, and keep checking while a
  // payment is pending -- only the backend's webhook can change its status.
  useRefreshOnReturn(reload, { polling: plans.some((p) => planState(p) === "pending_payment") });
  // Background refreshes keep the current content on screen.
  const loaded = Boolean(data) && status !== "error";
  const latestRequest = data?.requests?.[0];
  const [requesting, setRequesting] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawBusy, setWithdrawBusy] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");

  // pending / plan_created stay on screen; after a rejection or withdrawal
  // the client may ask again.
  const requestInProgress = ["pending", "plan_created"].includes(latestRequest?.status);

  const handleWithdraw = async () => {
    setWithdrawBusy(true);
    setWithdrawError("");
    try {
      await cancelMyPlanRequest(latestRequest._id);
      setWithdrawing(false);
      reload();
    } catch (err) {
      setWithdrawError(getApiErrorMessage(err, "We couldn't withdraw your request. Please try again."));
    } finally {
      setWithdrawBusy(false);
    }
  };

  return (
    <div className="bl-page">
      <div className="bl-page-header">
        <div>
          <h1>My Plan</h1>
          <p>Your plan is set up by your D6 Global Services account team.</p>
        </div>
      </div>

      {status === "loading" && !data && <LoadingState message="Loading your plan..." />}

      {status === "error" && (
        <ErrorState message={getApiErrorMessage(error, "We couldn't load your plan right now.")} onRetry={reload} />
      )}

      {loaded && plans.length === 0 && (
        <>
          {latestRequest && latestRequest.status !== "cancelled" && (
            <PlanRequestCard
              request={latestRequest}
              onWithdraw={() => {
                setWithdrawError("");
                setWithdrawing(true);
              }}
            />
          )}
          {!requestInProgress && (
            <EmptyState
              title="No plan yet"
              message="Your D6 Global Services account doesn't have an active plan yet. Request a plan and our team will review your requirements."
            >
              <button type="button" className="bl-btn bl-btn--primary" onClick={() => setRequesting(true)}>
                Request a Plan
              </button>
            </EmptyState>
          )}
        </>
      )}

      {loaded && plans.map((plan) => <PlanCard key={plan._id} plan={plan} setActivePage={setActivePage} />)}

      {requesting && (
        <RequestPlanModal
          onClose={() => setRequesting(false)}
          onSubmitted={() => {
            setRequesting(false);
            reload();
          }}
        />
      )}

      {withdrawing && latestRequest && (
        <ConfirmationModal
          title="Withdraw this request?"
          message={`Your request for ${latestRequest.serviceName} will be withdrawn. You can send a new request at any time.`}
          confirmLabel="Withdraw request"
          cancelLabel="Keep request"
          danger
          busy={withdrawBusy}
          error={withdrawError}
          onConfirm={handleWithdraw}
          onClose={() => setWithdrawing(false)}
        />
      )}
    </div>
  );
};

const REQUEST_MESSAGES = {
  pending: "Our team is reviewing your request. We'll be in touch with a plan and payment link.",
  plan_created: "Your request has been approved and your plan is being set up. It will appear here with a payment link shortly.",
  rejected: "We weren't able to go ahead with this request.",
};

const PlanRequestCard = ({ request, onWithdraw }) => (
  <section className="bl-card bl-plan" aria-label="Plan request">
    <div className="bl-plan-top">
      <div>
        <span className="bl-muted">Plan request</span>
        <h2>{request.serviceName}</h2>
      </div>
    </div>

    <dl className="bl-facts">
      <Fact label="Status">
        <StatusBadge kind="planRequest" value={request.status} />
      </Fact>
      <Fact label="Submitted">{formatDate(request.createdAt)}</Fact>
      {request.preferredBudgetPence > 0 && <Fact label="Preferred budget">{formatGBP(request.preferredBudgetPence)}</Fact>}
      {request.reviewedAt && <Fact label="Reviewed">{formatDate(request.reviewedAt)}</Fact>}
    </dl>

    <div className={`bl-alert ${request.status === "rejected" ? "bl-alert--danger" : "bl-alert--info"}`}>
      <div>
        {REQUEST_MESSAGES[request.status]}
        {request.status === "rejected" && request.rejectionReason && (
          <span className="bl-fact-sub bl-prewrap">Reason: {request.rejectionReason}</span>
        )}
      </div>
    </div>

    <div className="bl-plan-sections">
      <PlanSection title="Your requirements">
        <p className="bl-prewrap">{request.requirements}</p>
      </PlanSection>
      {request.additionalDetails && (
        <PlanSection title="Additional details">
          <p className="bl-prewrap">{request.additionalDetails}</p>
        </PlanSection>
      )}
    </div>

    {request.status === "pending" && (
      <div className="bl-plan-actions">
        <button type="button" className="bl-btn bl-btn--ghost" onClick={onWithdraw}>
          Withdraw request
        </button>
      </div>
    )}
  </section>
);

const PlanCard = ({ plan, setActivePage }) => {
  const billing = plan.billing || {};
  const state = planState(plan);
  const isLive = LIVE_SUBSCRIPTION_STATUSES.includes(billing.status);
  const checkoutUrl = safeExternalUrl(billing.checkoutUrl);
  const isPending = state === "pending_payment" || state === "link_expired";
  // Ended = a started subscription that was cancelled; "Ends on" = set to
  // cancel at period end. Both dates are Stripe's.
  const endDate =
    state === "cancelled" ? billing.endedAt || billing.canceledAt : billing.cancelAtPeriodEnd ? billing.currentPeriodEnd : null;

  const customFields = plan.customFields || [];
  const hasDetails =
    plan.servicesIncluded?.length ||
    plan.features?.length ||
    plan.deliverables?.length ||
    plan.limits?.length ||
    customFields.length ||
    plan.clientNotes;

  return (
    <section className="bl-card bl-plan">
      <div className="bl-plan-top">
        <div>
          <h2>{plan.name}</h2>
          {plan.status !== "active" && (
            <span className="bl-muted">Plan status: {PLAN_STATUS_LABELS[plan.status] || plan.status}</span>
          )}
        </div>
        <div className="bl-plan-price">
          <strong>{formatGBP(plan.amountPence)}</strong>
          <span>per month</span>
        </div>
      </div>

      {plan.description && <p className="bl-plan-desc">{plan.description}</p>}

      <BillingAlert billing={billing} state={state} checkoutUrl={checkoutUrl} />

      <dl className="bl-facts">
        <Fact label="Subscription status">
          <StatusBadge kind="state" value={state} />
        </Fact>
        <Fact label="Billing frequency">Monthly</Fact>
        <Fact label="Monthly price">{formatGBP(plan.amountPence)}</Fact>
        {isPending && <Fact label="Payment link created">{formatDate(billing.paymentLinkCreatedAt)}</Fact>}
        <Fact label="Subscription started">
          {billing.subscriptionStartDate ? formatDate(billing.subscriptionStartDate) : "Not started yet"}
        </Fact>
        {!billing.subscriptionStartDate && plan.startDate && (
          <Fact label="Planned start date">{formatDate(plan.startDate)}</Fact>
        )}
        {endDate && <Fact label={state === "cancelled" ? "Ended" : "Ends on"}>{formatDate(endDate)}</Fact>}
        <Fact label="Current billing period">
          {isLive ? formatPeriod(billing.currentPeriodStart, billing.currentPeriodEnd) : "—"}
        </Fact>
        <Fact label="Current period ends">{isLive ? formatDate(billing.currentPeriodEnd) : "—"}</Fact>
        <Fact label="Next payment">
          {billing.cancelAtPeriodEnd || state === "cancelled" ? "No further payments" : formatDate(billing.nextPaymentDate)}
        </Fact>
        <Fact label="Days remaining">{isLive ? <DaysRemaining until={billing.currentPeriodEnd} /> : "—"}</Fact>
        <Fact label="Last payment">
          <StatusBadge kind="lastPayment" value={billing.lastPaymentStatus} />
          {billing.lastPaymentAt && <span className="bl-fact-sub">{formatDate(billing.lastPaymentAt)}</span>}
        </Fact>
      </dl>

      {hasDetails && (
        <div className="bl-plan-sections">
          {plan.servicesIncluded?.length > 0 && (
            <PlanSection title="Services included">
              <ul className="bl-list">
                {plan.servicesIncluded.map((s, i) => (
                  <li key={i}>
                    <FaCheckCircle aria-hidden="true" />
                    <div>
                      <strong>{s.label}</strong>
                      {s.service?.title && s.service.title !== s.label && (
                        <span className="bl-fact-sub">{s.service.title}</span>
                      )}
                      {s.description && <p>{s.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </PlanSection>
          )}

          {plan.features?.length > 0 && (
            <PlanSection title="Features">
              <SimpleList items={plan.features} />
            </PlanSection>
          )}

          {plan.deliverables?.length > 0 && (
            <PlanSection title="Deliverables">
              <SimpleList items={plan.deliverables} />
            </PlanSection>
          )}

          {plan.limits?.length > 0 && (
            <PlanSection title="Limits">
              <dl className="bl-kv">
                {plan.limits.map((l, i) => (
                  <div key={i}>
                    <dt>{l.label}</dt>
                    <dd>
                      {l.value}
                      {l.unit ? ` ${l.unit}` : ""}
                    </dd>
                  </div>
                ))}
              </dl>
            </PlanSection>
          )}

          {customFields.length > 0 && (
            <PlanSection title="Additional details">
              <dl className="bl-kv">
                {customFields.map((f, i) => (
                  <div key={i}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </PlanSection>
          )}

          {plan.clientNotes && (
            <PlanSection title="Notes from your account team">
              <p className="bl-prewrap">{plan.clientNotes}</p>
            </PlanSection>
          )}
        </div>
      )}

      <div className="bl-plan-actions">
        {billing.status !== "none" && <ManagePaymentMethodButton />}
        {setActivePage && (
          <button type="button" className="bl-btn bl-btn--ghost" onClick={() => setActivePage("billing")}>
            View payments
          </button>
        )}
      </div>
    </section>
  );
};

// Messages for states that need the client's attention. Driven entirely by
// the backend's billing.state / checkoutUrl.
const BillingAlert = ({ billing, state, checkoutUrl }) => {
  if (state === "pending_payment" && checkoutUrl) {
    return (
      <div className="bl-alert bl-alert--warning">
        <div>
          <strong>Your payment link is ready.</strong> Complete your payment to activate your plan. Your plan is not
          active until the payment succeeds.
          {billing.checkoutExpiresAt && (
            <span className="bl-fact-sub">This link expires {formatDateTime(billing.checkoutExpiresAt)}.</span>
          )}
        </div>
        <a className="bl-btn bl-btn--primary" href={checkoutUrl}>
          Pay Now
        </a>
      </div>
    );
  }

  if (state === "pending_payment" || state === "link_expired") {
    return (
      <div className="bl-alert bl-alert--info">
        Your payment link has expired. Please contact your account team and they'll send you a new one.
      </div>
    );
  }

  if (state === "cancelled_before_payment") {
    return (
      <div className="bl-alert bl-alert--info">
        This payment link was cancelled{billing.canceledAt ? ` on ${formatDate(billing.canceledAt)}` : ""} and can no
        longer be used. No payment was taken.
      </div>
    );
  }

  if (billing.status === "past_due" || billing.status === "unpaid" || billing.lastPaymentStatus === "failed") {
    return (
      <div className="bl-alert bl-alert--danger">
        Your latest payment didn't go through. Please update your payment method below. Stripe will retry the payment
        automatically.
      </div>
    );
  }

  if (billing.lastPaymentStatus === "requires_action") {
    return (
      <div className="bl-alert bl-alert--warning">
        Your bank needs you to confirm your latest payment. Open "Manage Payment Method" to complete it.
      </div>
    );
  }

  if (billing.cancelAtPeriodEnd && billing.currentPeriodEnd) {
    return (
      <div className="bl-alert bl-alert--info">
        Your subscription is set to end on {formatDate(billing.currentPeriodEnd)}. You won't be charged again.
      </div>
    );
  }

  if (billing.status === "canceled") {
    return (
      <div className="bl-alert bl-alert--info">
        This subscription was cancelled{billing.canceledAt ? ` on ${formatDate(billing.canceledAt)}` : ""}.
      </div>
    );
  }

  return null;
};

const Fact = ({ label, children }) => (
  <div className="bl-fact">
    <dt>{label}</dt>
    <dd>{children}</dd>
  </div>
);

const PlanSection = ({ title, children }) => (
  <div className="bl-plan-section">
    <h3>{title}</h3>
    {children}
  </div>
);

const SimpleList = ({ items }) => (
  <ul className="bl-list">
    {items.map((item, i) => (
      <li key={i}>
        <FaCheckCircle aria-hidden="true" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default MyPlan;
