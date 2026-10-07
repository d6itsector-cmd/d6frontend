import { safeStripeUrl, paymentInvoice } from "../../utils/billingFormat";
import StatusBadge from "./StatusBadge";

// The Stripe invoice behind a payment row. Links open Stripe's own hosted
// invoice page / PDF -- there is no custom invoice page. The invoice status
// comes from Stripe, so a failed or pending payment shows "Unpaid"/"Void"
// rather than looking like a paid invoice.
//
// showDetails (admin): always show the invoice number and status.
const InvoiceLinks = ({ payment, showDetails = false }) => {
  const invoice = paymentInvoice(payment);
  if (!invoice) return <span className="bl-muted">—</span>;

  const hosted = safeStripeUrl(invoice.hostedInvoiceUrl);
  const pdf = safeStripeUrl(invoice.invoicePdfUrl);
  const showStatus = invoice.status && (showDetails || invoice.status !== "paid");

  return (
    <span className="bl-invoice">
      {(showDetails || showStatus) && (
        <span className="bl-invoice-meta">
          {showDetails && <span className="bl-invoice-number">{invoice.number || "No number yet"}</span>}
          {showStatus && <StatusBadge kind="invoice" value={invoice.status} />}
        </span>
      )}

      {hosted || pdf ? (
        <span className="bl-links">
          {hosted && (
            <a href={hosted} target="_blank" rel="noopener noreferrer">
              View Invoice
            </a>
          )}
          {pdf && (
            <a href={pdf} target="_blank" rel="noopener noreferrer">
              Download PDF
            </a>
          )}
        </span>
      ) : (
        <span className="bl-fact-sub">Invoice not available yet</span>
      )}
    </span>
  );
};

export default InvoiceLinks;
