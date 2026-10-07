import "../../Billing/Billing.css";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";

import { getMyPlans, getMyPaymentRequests } from "../../../services/billingApi";
import { formatGBP, formatDateTime, LIVE_SUBSCRIPTION_STATUSES } from "../../../utils/billingFormat";
import { useBillingQuery } from "../../Billing/useBillingQuery";
import StatusBadge from "../../Billing/StatusBadge";

// Re-read billing state a few times after the redirect: Stripe's webhook
// usually reaches the backend within seconds, but can land after the client
// is already back here.
const POLL_INTERVAL_MS = 4000;
const MAX_POLLS = 8;

// Stripe Checkout return pages (/dashboard/billing/success|cancelled).
// This NEVER changes billing state: the subscription/payment is activated
// exclusively by the verified Stripe webhook on the backend. On success it
// only re-reads the current state with GET /api/my-plan or
// GET /api/payment-requests. `session_id` in the URL is deliberately ignored.
const CheckoutResult = ({ outcome, setActivePage }) => {
  const [params] = useSearchParams();
  const isOneOff = params.get("type") === "payment_request";
  const success = outcome === "success";

  return (
    <div className="bl-page">
      <section className="bl-card bl-result">
        <div className={`bl-result-icon ${success ? "bl-result-icon--success" : ""}`}>
          {success ? <FaCheckCircle aria-hidden="true" /> : <FaInfoCircle aria-hidden="true" />}
        </div>

        {success ? (
          <>
            <h1>Thank you, your payment was submitted</h1>
            <p>
              {isOneOff
                ? "We're confirming your payment with Stripe. It will show as Paid as soon as it's confirmed."
                : "We're confirming your payment with Stripe. Your subscription status and billing dates update automatically once it's confirmed, usually within a minute."}
            </p>
            <LiveStatus isOneOff={isOneOff} />
          </>
        ) : (
          <>
            <h1>Payment not completed</h1>
            <p>
              No payment was taken. You can return to the payment from{" "}
              {isOneOff ? "Billing" : "My Plan"} while the link is still valid, or contact your account team for a new
              one.
            </p>
          </>
        )}

        <div className="bl-result-actions">
          <button type="button" className="bl-btn bl-btn--primary" onClick={() => setActivePage(isOneOff ? "billing" : "my-plan")}>
            {isOneOff ? "Go to Billing" : "Go to My Plan"}
          </button>
          <button type="button" className="bl-btn bl-btn--ghost" onClick={() => setActivePage("dashboard")}>
            Back to dashboard
          </button>
        </div>
      </section>
    </div>
  );
};

// Current backend state, re-fetched until it settles (or MAX_POLLS).
const LiveStatus = ({ isOneOff }) => {
  const [polls, setPolls] = useState(0);
  const { status, data, reload } = useBillingQuery(
    async () => {
      if (isOneOff) return { requests: (await getMyPaymentRequests({ limit: 5 })).items, checkedAt: new Date() };
      return { plans: await getMyPlans(), checkedAt: new Date() };
    },
    isOneOff ? "requests" : "plans"
  );

  const plans = data?.plans || [];
  const requests = data?.requests || [];
  const settled = isOneOff
    ? requests.length > 0 && !requests.some((r) => r.status === "processing")
    : plans.some((p) => LIVE_SUBSCRIPTION_STATUSES.includes(p.billing?.status));
  const keepPolling = status !== "loading" && !settled && polls < MAX_POLLS;

  useEffect(() => {
    if (!keepPolling) return;
    const t = setTimeout(() => {
      setPolls((n) => n + 1);
      reload();
    }, POLL_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [keepPolling, polls, reload]);

  if (!data) return status === "error" ? null : <p className="bl-fact-sub">Checking the latest status...</p>;

  const items = isOneOff
    ? requests.slice(0, 3).map((r) => ({
        key: r._id,
        label: `${r.description} · ${formatGBP(r.amountPence)}`,
        badge: <StatusBadge kind="request" value={r.status} />,
      }))
    : plans.map((p) => ({
        key: p._id,
        label: `${p.name} · ${formatGBP(p.amountPence)}/month`,
        badge: <StatusBadge kind="subscription" value={p.billing?.status} />,
      }));

  return (
    <div className="bl-live-status" aria-live="polite">
      <ul>
        {items.map((item) => (
          <li key={item.key}>
            <span>{item.label}</span>
            {item.badge}
          </li>
        ))}
      </ul>
      <span className="bl-fact-sub">
        {keepPolling || status === "loading" ? "Checking for Stripe's confirmation..." : "Status from our billing system"}
        {" · "}last checked {formatDateTime(data.checkedAt)}
        {!keepPolling && status !== "loading" && (
          <>
            {" · "}
            <button
              type="button"
              className="bl-link-btn"
              onClick={() => {
                setPolls(0);
                reload();
              }}
            >
              Refresh
            </button>
          </>
        )}
      </span>
    </div>
  );
};

export default CheckoutResult;
