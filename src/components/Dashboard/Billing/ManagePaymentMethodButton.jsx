import { useState } from "react";
import { FaCreditCard } from "react-icons/fa";

import { createBillingPortalSession, getApiErrorMessage, getApiErrorStatus } from "../../../services/billingApi";
import { safeExternalUrl } from "../../../utils/billingFormat";

// Opens the Stripe-hosted Billing Portal. Card details are only ever entered
// on Stripe's page -- nothing payment-related is handled in React.
const ManagePaymentMethodButton = ({ className = "bl-btn bl-btn--primary" }) => {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null); // { tone, text }

  const handleClick = async () => {
    setBusy(true);
    setNotice(null);
    try {
      const { url } = await createBillingPortalSession();
      const target = safeExternalUrl(url);
      if (!target) throw new Error("Invalid portal URL");
      window.location.assign(target);
      // Leave `busy` on while the browser navigates away.
    } catch (err) {
      const status = getApiErrorStatus(err);
      setNotice(
        status === 404
          ? {
              tone: "info",
              text: "There's no billing account for you yet. One is created when your account team sends your first payment link.",
            }
          : { tone: "error", text: getApiErrorMessage(err, "We couldn't open the billing portal. Please try again.") }
      );
      setBusy(false);
    }
  };

  return (
    <div className="bl-portal">
      <button type="button" className={className} onClick={handleClick} disabled={busy}>
        <FaCreditCard aria-hidden="true" />
        {busy ? "Opening secure portal..." : "Manage Payment Method"}
      </button>
      {notice && <p className={`bl-inline-note bl-inline-note--${notice.tone}`}>{notice.text}</p>}
    </div>
  );
};

export default ManagePaymentMethodButton;
