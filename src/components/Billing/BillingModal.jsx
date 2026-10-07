import { useEffect } from "react";

// Modal shell for billing forms/details. Escape and backdrop click close it
// unless `busy` (a request is in flight).
const BillingModal = ({ title, onClose, busy = false, wide = false, children, footer }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, busy]);

  return (
    <div className="bl-modal-overlay" onClick={() => !busy && onClose()}>
      <div
        className={`bl-modal ${wide ? "bl-modal--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bl-modal-header">
          <h2>{title}</h2>
          <button type="button" className="bl-modal-close" onClick={onClose} disabled={busy} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="bl-modal-body">{children}</div>

        {footer && <div className="bl-modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default BillingModal;
