import "../../Billing/Billing.css";

import { FaCheckCircle } from "react-icons/fa";

import { getMyPlans, getApiErrorMessage } from "../../../services/billingApi";
import {
  formatGBP,
  formatDate,
  formatDateTime,
  formatPeriod,
  safeExternalUrl,
  LIVE_SUBSCRIPTION_STATUSES,
  PLAN_STATUS_LABELS,
} from "../../../utils/billingFormat";
import { useBillingQuery } from "../../Billing/useBillingQuery";
import StatusBadge from "../../Billing/StatusBadge";
import DaysRemaining from "../../Billing/DaysRemaining";
import { LoadingState, EmptyState, ErrorState } from "../../Billing/StateViews";
import ManagePaymentMethodButton from "./ManagePaymentMethodButton";

// Read-only view of the admin-authored plan + Stripe-synced billing state
// (GET /api/my-plan). Nothing here is editable by the client.
const MyPlan = ({ setActivePage }) => {
  const { status, data: plans, error, reload } = useBillingQuery(getMyPlans);

  return (
    <div className="bl-page">
      <div className="bl-page-header">
        <div>
          <h1>My Plan</h1>
          <p>Your plan is set up by your D6 Global Media account team.</p>
        </div>
      </div>

      {status === "loading" && <LoadingState message="Loading your plan..." />}

      {status === "error" && (
        <ErrorState message={getApiErrorMessage(error, "We couldn't load your plan right now.")} onRetry={reload} />
      )}

      {status === "success" && plans.length === 0 && (
        <EmptyState
          title="No plan yet"
          message="Your account team hasn't set up a plan for you yet. Once it's ready, its services, price and billing dates will appear here."
        />
      )}

      {status === "success" &&
        plans.map((plan) => <PlanCard key={plan._id} plan={plan} setActivePage={setActivePage} />)}
    </div>
  );
};

const PlanCard = ({ plan, setActivePage }) => {
  const billing = plan.billing || {};
  const isLive = LIVE_SUBSCRIPTION_STATUSES.includes(billing.status);
  const checkoutUrl = safeExternalUrl(billing.checkoutUrl);

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

      <BillingAlert billing={billing} checkoutUrl={checkoutUrl} />

      <dl className="bl-facts">
        <Fact label="Subscription status">
          <StatusBadge kind="subscription" value={billing.status} />
        </Fact>
        <Fact label="Billing frequency">Monthly</Fact>
        <Fact label="Monthly price">{formatGBP(plan.amountPence)}</Fact>
        <Fact label="Start date">{formatDate(plan.startDate, "Not set")}</Fact>
        <Fact label="Current billing period">
          {isLive ? formatPeriod(billing.currentPeriodStart, billing.currentPeriodEnd) : "—"}
        </Fact>
        <Fact label="Current period ends">{isLive ? formatDate(billing.currentPeriodEnd) : "—"}</Fact>
        <Fact label="Next payment">
          {billing.cancelAtPeriodEnd ? "No further payments" : formatDate(billing.nextPaymentDate)}
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
// the backend's billing.status / checkoutUrl.
const BillingAlert = ({ billing, checkoutUrl }) => {
  if (billing.status === "pending_checkout" && checkoutUrl) {
    return (
      <div className="bl-alert bl-alert--warning">
        <div>
          <strong>Your first payment is due.</strong> Complete it on Stripe's secure checkout to start your monthly
          subscription.
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

  if (billing.status === "pending_checkout" || billing.status === "checkout_expired") {
    return (
      <div className="bl-alert bl-alert--info">
        Your payment link has expired. Please contact your account team and they'll send you a new one.
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
