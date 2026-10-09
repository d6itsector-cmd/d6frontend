import "../../Billing/Billing.css";
import "./BillingOverview.css";

import { getMyPlans, getMyPaymentRequests } from "../../../services/billingApi";
import {
  formatGBP,
  formatDate,
  formatDateTime,
  planState,
  safeExternalUrl,
} from "../../../utils/billingFormat";
import { useBillingQuery } from "../../Billing/useBillingQuery";
import { useRefreshOnReturn } from "../../Billing/useRefreshOnReturn";
import StatusBadge from "../../Billing/StatusBadge";

// How long a withdrawn one-off request stays on the Home dashboard. Plans
// keep their cancelled state on the plan itself, so they need no window.
const RECENT_CANCELLED_MS = 14 * 24 * 60 * 60 * 1000;

const PENDING_PLAN_STATES = ["pending_payment", "link_expired"];
const OPEN_REQUEST_STATES = ["pending_payment", "link_expired", "payment_failed", "processing"];
// States of a subscription Stripe has actually started.
const STARTED_PLAN_STATES = ["active", "past_due", "payment_failed", "paused", "cancelled"];

const requestState = (r) =>
  r.state || { pending: "pending_payment", expired: "link_expired", failed: "payment_failed", cancelled: "cancelled_before_payment" }[r.status] || r.status;

// Reuses GET /api/my-plan and GET /api/payment-requests (the same data as My
// Plan / Billing). A failing requests call never hides the plans.
const loadBilling = async () => {
  const [plans, requests] = await Promise.all([
    getMyPlans(),
    getMyPaymentRequests({ limit: 20 })
      .then((r) => r.items)
      .catch(() => []),
  ]);
  return { plans, requests, loadedAt: Date.now() };
};

/**
 * Home dashboard billing: payment links waiting for the client (with Pay
 * Now), links that were withdrawn, and the dates of subscriptions Stripe has
 * started. Display only -- every status comes from the backend.
 */
const BillingOverview = ({ setActivePage }) => {
  const { data, reload } = useBillingQuery(loadBilling);
  const plans = data?.plans || [];
  const requests = data?.requests || [];

  const pendingPlans = plans.filter((p) => PENDING_PLAN_STATES.includes(planState(p)));
  const cancelledLinks = plans.filter((p) => planState(p) === "cancelled_before_payment");
  const startedPlans = plans.filter((p) => STARTED_PLAN_STATES.includes(planState(p)));
  const openRequests = requests.filter((r) => OPEN_REQUEST_STATES.includes(requestState(r)));
  const cancelledRequests = requests.filter(
    (r) =>
      requestState(r) === "cancelled_before_payment" &&
      data.loadedAt - new Date(r.cancelledAt || r.createdAt).getTime() < RECENT_CANCELLED_MS
  );

  // Keep checking while something is awaiting Stripe's confirmation.
  useRefreshOnReturn(reload, { polling: pendingPlans.length + openRequests.length > 0 });

  // Non-critical section: nothing while loading or on error, and nothing at
  // all for a client without any billing yet.
  const hasPending = pendingPlans.length + openRequests.length > 0;
  if (!data || (!hasPending && !startedPlans.length && !cancelledLinks.length && !cancelledRequests.length)) return null;

  return (
    <section className="bl-card bl-overview" aria-label="Billing">
      <div className="bl-card-header bl-card-header--row">
        <div>
          <h2>Billing</h2>
          <p>{hasPending ? "You have a payment waiting." : "Your plan and payment status."}</p>
        </div>
        <button type="button" className="bl-btn bl-btn--ghost bl-btn--sm" onClick={() => setActivePage("my-plan")}>
          View My Plan
        </button>
      </div>

      {pendingPlans.map((plan) => (
        <PendingPayment
          key={plan._id}
          name={plan.name}
          amountPence={plan.amountPence}
          frequency="Monthly"
          state={planState(plan)}
          createdAt={plan.billing?.paymentLinkCreatedAt || plan.createdAt}
          payUrl={safeExternalUrl(plan.billing?.checkoutUrl)}
          expiresAt={plan.billing?.checkoutExpiresAt}
          message="Your payment link is ready. Complete your payment to activate your plan."
        />
      ))}

      {openRequests.map((r) => (
        <PendingPayment
          key={r._id}
          name={r.description}
          amountPence={r.amountPence}
          frequency="One-off payment"
          state={requestState(r)}
          createdAt={r.createdAt}
          payUrl={safeExternalUrl(r.paymentUrl)}
          expiresAt={r.expiresAt}
          message={
            requestState(r) === "processing"
              ? "Your payment is being confirmed by Stripe."
              : "Your payment link is ready. Complete your payment to settle this request."
          }
        />
      ))}

      {cancelledLinks.map((plan) => (
        <div key={plan._id} className="bl-alert bl-alert--info">
          <div>
            <strong>{plan.name}</strong>: the payment link was cancelled
            {plan.billing?.canceledAt ? ` on ${formatDate(plan.billing.canceledAt)}` : ""}. No payment was taken.
          </div>
          <StatusBadge kind="state" value="cancelled_before_payment" />
        </div>
      ))}

      {cancelledRequests.map((r) => (
        <div key={r._id} className="bl-alert bl-alert--info">
          <div>
            <strong>{r.description}</strong>: this payment request was cancelled
            {r.cancelledAt ? ` on ${formatDate(r.cancelledAt)}` : ""}. No payment was taken.
          </div>
          <StatusBadge kind="state" value="cancelled_before_payment" />
        </div>
      ))}

      {startedPlans.map((plan) => (
        <SubscriptionSummary key={plan._id} plan={plan} />
      ))}
    </section>
  );
};

const PendingPayment = ({ name, amountPence, frequency, state, createdAt, payUrl, expiresAt, message }) => {
  const payable = state === "pending_payment" && payUrl;
  return (
    <div className={`bl-alert ${payable ? "bl-alert--warning" : "bl-alert--info"}`}>
      <div>
        <strong>{name}</strong> · {formatGBP(amountPence)} · {frequency} <StatusBadge kind="state" value={state} />
        <span className="bl-fact-sub">
          {payable
            ? message
            : state === "link_expired" || state === "payment_failed"
            ? "This payment link is no longer valid. Your account team will send you a new one."
            : message}
        </span>
        <span className="bl-fact-sub">
          Created {formatDate(createdAt)}
          {payable && expiresAt ? ` · link expires ${formatDateTime(expiresAt)}` : ""}
        </span>
      </div>
      {payable && (
        <a className="bl-btn bl-btn--primary" href={payUrl}>
          Pay Now
        </a>
      )}
    </div>
  );
};

const SubscriptionSummary = ({ plan }) => {
  const billing = plan.billing || {};
  const state = planState(plan);
  const endDate =
    state === "cancelled" ? billing.endedAt || billing.canceledAt : billing.cancelAtPeriodEnd ? billing.currentPeriodEnd : null;

  return (
    <dl className="bl-facts bl-overview-facts" aria-label={`${plan.name} subscription`}>
      <Fact label="Plan">{plan.name}</Fact>
      <Fact label="Status">
        <StatusBadge kind="state" value={state} />
      </Fact>
      <Fact label="Amount">{formatGBP(plan.amountPence)}</Fact>
      <Fact label="Billing frequency">Monthly</Fact>
      <Fact label="Subscription started">{formatDate(billing.subscriptionStartDate)}</Fact>
      <Fact label="Next payment">
        {state === "cancelled" || billing.cancelAtPeriodEnd ? "No further payments" : formatDate(billing.nextPaymentDate)}
      </Fact>
      {endDate && <Fact label={state === "cancelled" ? "Ended" : "Ends on"}>{formatDate(endDate)}</Fact>}
    </dl>
  );
};

const Fact = ({ label, children }) => (
  <div className="bl-fact">
    <dt>{label}</dt>
    <dd>{children}</dd>
  </div>
);

export default BillingOverview;
