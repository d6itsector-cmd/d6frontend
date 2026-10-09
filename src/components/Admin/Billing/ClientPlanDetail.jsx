import { useState } from "react";

import {
  getClientPlan,
  subscribeClientPlan,
  resendClientPlanLink,
  cancelClientPlanSubscription,
  cancelClientPlanPaymentLink,
  getApiErrorMessage,
  getApiErrorStatus,
} from "../../../services/billingApi";
import {
  formatGBP,
  formatDate,
  formatDateTime,
  formatPeriod,
  clientLabel,
  safeExternalUrl,
  emailFailureText,
  planState,
  LINK_PENDING_STATUSES,
  LIVE_SUBSCRIPTION_STATUSES,
  SUBSCRIPTION_STATUS_LABELS,
} from "../../../utils/billingFormat";
import { useBillingQuery } from "../../Billing/useBillingQuery";
import BillingModal from "../../Billing/BillingModal";
import ConfirmationModal from "../../Billing/ConfirmationModal";
import StatusBadge from "../../Billing/StatusBadge";
import DaysRemaining from "../../Billing/DaysRemaining";
import { LoadingState, ErrorState } from "../../Billing/StateViews";
import ClientPlanForm from "./ClientPlanForm";

/**
 * Plan + subscription view with the Stripe actions. Every state shown here is
 * what the backend returns; after an action the record is re-fetched rather
 * than assumed (e.g. a new subscription is "Awaiting first payment", never
 * "Active", until Stripe's webhook says so).
 */
const ClientPlanDetail = ({ planId, onClose, onChanged, notify }) => {
  const { status, data, error, reload } = useBillingQuery(() => getClientPlan(planId), planId);
  const [editing, setEditing] = useState(false);
  // "subscribe" | "cancelLink" (unpaid link) | "cancel" (paid subscription)
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(true);

  const refresh = () => {
    reload();
    onChanged();
  };

  const run = async (action, onSuccess) => {
    setBusy(true);
    setActionError("");
    try {
      const result = await action();
      onSuccess(result);
      setConfirm(null);
      refresh();
    } catch (err) {
      const message = getApiErrorMessage(err, "That action failed. Please try again.");
      if (confirm) setActionError(message);
      else notify("error", message);
      // 409 = the record moved on (e.g. the client just paid): show its real state.
      if (getApiErrorStatus(err) === 409) refresh();
    } finally {
      setBusy(false);
    }
  };

  // The Stripe link exists either way; only the email outcome differs.
  const emailOutcome = (emailSent, email) =>
    emailSent
      ? "Payment link emailed to the client. It is also shown on the client's dashboard."
      : `${emailFailureText(email)} The link is still valid and shown on the client's dashboard. Use Resend Payment Link, or copy the link and send it manually.`;

  const handleSubscribe = () =>
    run(
      () => subscribeClientPlan(planId),
      ({ subscription, emailSent, email }) =>
        notify(
          emailSent ? "success" : "warning",
          `Subscription created (${SUBSCRIPTION_STATUS_LABELS[subscription?.status] || subscription?.status}). ${emailOutcome(emailSent, email)}`
        )
    );

  const handleResend = () =>
    run(
      () => resendClientPlanLink(planId),
      ({ emailSent, email }) =>
        notify(emailSent ? "success" : "warning", emailSent ? "Payment link re-sent to the client." : emailOutcome(false, email))
    );

  const handleCancelLink = () =>
    run(
      () => cancelClientPlanPaymentLink(planId),
      ({ emailSent, email }) =>
        notify(
          emailSent ? "success" : "warning",
          `Unpaid payment link cancelled; it can no longer be paid. ${emailSent ? "The client was emailed." : emailFailureText(email)}`
        )
    );

  const handleCancel = () =>
    run(
      () => cancelClientPlanSubscription(planId, cancelAtPeriodEnd),
      (result) => {
        if (result.pendingStripeConfirmation) {
          notify(
            "info",
            result.mode === "at_period_end"
              ? "Cancellation at period end sent to Stripe. The status will update once Stripe confirms."
              : "Immediate cancellation sent to Stripe. The status will update once Stripe confirms."
          );
        } else {
          const label = SUBSCRIPTION_STATUS_LABELS[result.subscription?.status] || result.subscription?.status;
          notify("success", `Unpaid payment link cancelled. Subscription status: ${label}.`);
        }
      }
    );

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      notify("success", "Payment link copied.");
    } catch {
      notify("error", "Couldn't copy the link. Select it and copy manually.");
    }
  };

  if (editing && data?.plan) {
    return (
      <ClientPlanForm
        plan={data.plan}
        onClose={() => setEditing(false)}
        onSaved={() => {
          setEditing(false);
          notify("success", "Plan saved.");
          refresh();
        }}
      />
    );
  }

  const plan = data?.plan;
  const sub = data?.subscription;
  const billing = plan?.billing || {};
  const isOpen = Boolean(sub?.isOpen);
  const isLive = LIVE_SUBSCRIPTION_STATUSES.includes(billing.status);
  // Unpaid link (no Stripe subscription yet) vs a subscription Stripe has
  // started: each has its own, clearly named cancel action.
  const linkPending = isOpen && LINK_PENDING_STATUSES.includes(sub.status) && !sub.stripeSubscriptionId;
  const startedSubscription = isOpen && !linkPending;
  const state = data?.state || planState(plan);
  const checkoutUrl = safeExternalUrl(sub?.checkoutUrl);
  const cancelPendingConfirmation = isOpen && sub?.cancelRequestedAt && !billing.cancelAtPeriodEnd;

  return (
    <>
      <BillingModal
        title={plan ? plan.name : "Client plan"}
        onClose={onClose}
        busy={busy || Boolean(confirm)}
        wide
        footer={
          plan && (
            <>
              <button type="button" className="bl-btn bl-btn--ghost" onClick={() => setEditing(true)} disabled={busy}>
                Edit plan
              </button>
              {!isOpen && (
                <button type="button" className="bl-btn bl-btn--primary" onClick={() => setConfirm("subscribe")} disabled={busy}>
                  Create Subscription / Send Payment Link
                </button>
              )}
              {linkPending && (
                <button type="button" className="bl-btn bl-btn--primary" onClick={handleResend} disabled={busy}>
                  {busy ? "Sending..." : "Resend Payment Link"}
                </button>
              )}
              {linkPending && (
                <button
                  type="button"
                  className="bl-btn bl-btn--danger"
                  onClick={() => {
                    setActionError("");
                    setConfirm("cancelLink");
                  }}
                  disabled={busy}
                >
                  Cancel payment link
                </button>
              )}
              {startedSubscription && (
                <button
                  type="button"
                  className="bl-btn bl-btn--danger"
                  onClick={() => {
                    setCancelAtPeriodEnd(isLive);
                    setActionError("");
                    setConfirm("cancel");
                  }}
                  disabled={busy}
                >
                  Cancel subscription
                </button>
              )}
            </>
          )
        }
      >
        {status === "loading" && !plan && <LoadingState message="Loading plan..." />}
        {status === "error" && (
          <ErrorState message={getApiErrorMessage(error, "We couldn't load this plan.")} onRetry={reload} />
        )}

        {plan && (
          <div className="bl-detail">
            <section>
              <h3>Client</h3>
              <dl className="bl-kv">
                <div>
                  <dt>Client</dt>
                  <dd>{clientLabel(plan.client)}</dd>
                </div>
                <div>
                  <dt>Login email</dt>
                  <dd>{plan.client?.email || "—"}</dd>
                </div>
                <div>
                  <dt>Billing email</dt>
                  <dd>{plan.billingEmail || "Login email"}</dd>
                </div>
              </dl>
            </section>

            <section>
              <h3>Plan</h3>
              <dl className="bl-kv">
                <div>
                  <dt>Monthly amount</dt>
                  <dd>{formatGBP(plan.amountPence)} / month</dd>
                </div>
                <div>
                  <dt>Plan status</dt>
                  <dd>
                    <StatusBadge kind="plan" value={plan.status} />
                  </dd>
                </div>
                <div>
                  <dt>Start date</dt>
                  <dd>{formatDate(plan.startDate, "Not set")}</dd>
                </div>
                <div>
                  <dt>Last updated</dt>
                  <dd>{formatDateTime(plan.updatedAt)}</dd>
                </div>
              </dl>
              {plan.description && <p className="bl-prewrap">{plan.description}</p>}
            </section>

            <section>
              <h3>Billing (managed by Stripe)</h3>
              {cancelPendingConfirmation && (
                <p className="bl-alert bl-alert--info">
                  Cancellation requested {formatDateTime(sub.cancelRequestedAt)}. Waiting for Stripe to confirm.
                </p>
              )}
              {billing.cancelAtPeriodEnd && (
                <p className="bl-alert bl-alert--info">
                  Set to cancel at the end of the current period ({formatDate(billing.currentPeriodEnd)}).
                </p>
              )}
              <dl className="bl-kv">
                <div>
                  <dt>Status</dt>
                  <dd>
                    <StatusBadge kind="state" value={state} />
                  </dd>
                </div>
                <div>
                  <dt>Stripe status</dt>
                  <dd>
                    <StatusBadge kind="subscription" value={billing.status} />
                  </dd>
                </div>
                <div>
                  <dt>Subscription started</dt>
                  <dd>{sub?.stripeSubscriptionId && sub.startDate ? formatDate(sub.startDate) : "Not started"}</dd>
                </div>
                <div>
                  <dt>Current period</dt>
                  <dd>{isLive ? formatPeriod(billing.currentPeriodStart, billing.currentPeriodEnd) : "—"}</dd>
                </div>
                <div>
                  <dt>Next payment</dt>
                  <dd>{billing.cancelAtPeriodEnd ? "None (cancelling)" : formatDate(billing.nextPaymentDate)}</dd>
                </div>
                <div>
                  <dt>Days remaining</dt>
                  <dd>{isLive ? <DaysRemaining until={billing.currentPeriodEnd} /> : "—"}</dd>
                </div>
                <div>
                  <dt>Last payment</dt>
                  <dd>
                    <StatusBadge kind="lastPayment" value={billing.lastPaymentStatus} />
                    {billing.lastPaymentAt && <span className="bl-fact-sub">{formatDateTime(billing.lastPaymentAt)}</span>}
                  </dd>
                </div>
                {billing.canceledAt && (
                  <div>
                    <dt>{state === "cancelled_before_payment" ? "Link cancelled" : "Cancelled"}</dt>
                    <dd>{formatDateTime(billing.canceledAt)}</dd>
                  </div>
                )}
              </dl>

              {sub && LINK_PENDING_STATUSES.includes(sub.status) && (
                <div className="bl-link-box">
                  <dl className="bl-kv">
                    <div>
                      <dt>Link emailed</dt>
                      <dd>{sub.emailedAt ? formatDateTime(sub.emailedAt) : "Not sent"}</dd>
                    </div>
                    <div>
                      <dt>Link expires</dt>
                      <dd>{formatDateTime(sub.checkoutExpiresAt)}</dd>
                    </div>
                    <div>
                      <dt>Links issued</dt>
                      <dd>{sub.checkoutAttempts ?? "—"}</dd>
                    </div>
                  </dl>
                  {checkoutUrl && sub.status === "pending_checkout" && (
                    <div className="bl-copy">
                      <input readOnly value={checkoutUrl} aria-label="Payment link" onFocus={(e) => e.target.select()} />
                      <button type="button" className="bl-btn bl-btn--ghost bl-btn--sm" onClick={() => copyLink(checkoutUrl)}>
                        Copy link
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>

            <PlanContent plan={plan} />
          </div>
        )}
      </BillingModal>

      {confirm === "subscribe" && plan && (
        <ConfirmationModal
          title="Create subscription and send payment link?"
          message={`This creates a monthly Stripe subscription of ${formatGBP(plan.amountPence)} for ${clientLabel(
            plan.client
          )} and emails the payment link to ${plan.billingEmail || plan.client?.email}. The subscription becomes active only after the client pays.`}
          confirmLabel="Create & send link"
          busy={busy}
          error={actionError}
          onConfirm={handleSubscribe}
          onClose={() => setConfirm(null)}
        />
      )}

      {confirm === "cancelLink" && plan && (
        <ConfirmationModal
          title="Cancel unpaid payment link?"
          message={`The client hasn't paid. This expires the ${formatGBP(plan.amountPence)}/month Stripe payment link so it can no longer be paid, removes Pay Now from the client's dashboard and emails the client. If the client has already paid, nothing is changed.`}
          confirmLabel="Cancel payment link"
          cancelLabel="Keep link"
          danger
          busy={busy}
          error={actionError}
          onConfirm={handleCancelLink}
          onClose={() => setConfirm(null)}
        />
      )}

      {confirm === "cancel" && plan && (
        <ConfirmationModal
          title="Cancel subscription"
          confirmLabel="Confirm cancellation"
          cancelLabel="Keep subscription"
          danger
          busy={busy}
          error={actionError}
          onConfirm={handleCancel}
          onClose={() => setConfirm(null)}
        >
          <div className="bl-radio-group" role="radiogroup" aria-label="When to cancel">
            <label className={!isLive ? "bl-disabled" : ""}>
              <input
                type="radio"
                name="cancel-mode"
                checked={cancelAtPeriodEnd}
                disabled={!isLive}
                onChange={() => setCancelAtPeriodEnd(true)}
              />
              <span>
                <strong>Cancel at period end</strong>
                The client keeps the service until {formatDate(billing.currentPeriodEnd)} and isn't charged again.
              </span>
            </label>
            <label>
              <input type="radio" name="cancel-mode" checked={!cancelAtPeriodEnd} onChange={() => setCancelAtPeriodEnd(false)} />
              <span>
                <strong>Cancel immediately</strong>
                Billing stops now. Stripe confirms the cancellation via webhook.
              </span>
            </label>
            {["incomplete", "unpaid"].includes(sub?.status) && (
              <p className="bl-hint">An {sub.status} subscription has no paid period, so Stripe cancels it immediately.</p>
            )}
          </div>
        </ConfirmationModal>
      )}
    </>
  );
};

const PlanContent = ({ plan }) => {
  const blocks = [
    ["Services included", (plan.servicesIncluded || []).map((s) => [s.label, [s.service?.title, s.description].filter(Boolean).join(" — ")])],
    ["Features", (plan.features || []).map((f) => [f, ""])],
    ["Deliverables", (plan.deliverables || []).map((d) => [d, ""])],
    ["Limits", (plan.limits || []).map((l) => [l.label, `${l.value}${l.unit ? ` ${l.unit}` : ""}`])],
    [
      "Custom fields",
      (plan.customFields || []).map((f) => [f.label, `${f.value}${f.clientVisible === false ? " (admin only)" : ""}`]),
    ],
  ].filter(([, rows]) => rows.length);

  return (
    <>
      {blocks.map(([title, rows]) => (
        <section key={title}>
          <h3>{title}</h3>
          <ul className="bl-plain-list">
            {rows.map(([main, sub], i) => (
              <li key={i}>
                <strong>{main}</strong>
                {sub && <span> — {sub}</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {plan.clientNotes && (
        <section>
          <h3>Client-visible notes</h3>
          <p className="bl-prewrap">{plan.clientNotes}</p>
        </section>
      )}
      {plan.adminNotes && (
        <section>
          <h3>Admin notes</h3>
          <p className="bl-prewrap">{plan.adminNotes}</p>
        </section>
      )}
    </>
  );
};

export default ClientPlanDetail;
