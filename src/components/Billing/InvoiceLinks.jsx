import { safeExternalUrl } from "../../utils/billingFormat";

// Stripe-hosted invoice/receipt links on a Payment row, when Stripe has them.
const InvoiceLinks = ({ payment }) => {
  const hosted = safeExternalUrl(payment.hostedInvoiceUrl);
  const pdf = safeExternalUrl(payment.invoicePdfUrl);
  if (!hosted && !pdf) return <span className="bl-muted">—</span>;

  return (
    <span className="bl-links">
      {hosted && (
        <a href={hosted} target="_blank" rel="noopener noreferrer">
          View
        </a>
      )}
      {pdf && (
        <a href={pdf} target="_blank" rel="noopener noreferrer">
          PDF
        </a>
      )}
    </span>
  );
};

export default InvoiceLinks;
