import "../../Billing/Billing.css";

import { useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";

// Stripe Checkout return pages (/dashboard/billing/success|cancelled).
// DISPLAY ONLY: this never calls the API or changes billing state -- the
// subscription/payment is activated exclusively by the verified Stripe
// webhook on the backend. `session_id` in the URL is deliberately ignored.
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
                ? "We're confirming your payment with Stripe. It will show as Paid under Billing as soon as it's confirmed."
                : "We're confirming your payment with Stripe. Your subscription status and billing dates will update automatically once it's confirmed, usually within a minute."}
            </p>
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

export default CheckoutResult;
