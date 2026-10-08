import { useEffect, useId } from "react";

// Modal shell for billing forms/details. Escape and backdrop click close it
// unless `busy` (a request is in flight). Header and footer stay put while
// the body scrolls; the page behind is locked while the modal is open.
//
// size: "default" (560px) | "form" (780px, multi-column forms) | "wide"
// (900px, detail views). `wide` is kept for existing callers.
const BillingModal = ({ title, subtitle, onClose, busy = false, wide = false, size, children, footer }) => {
  const titleId = useId();
  const subtitleId = useId();
  const modalSize = size || (wide ? "wide" : "default");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, busy]);

  // Lock page scroll behind the modal (restores the previous value, so
  // stacked modals unwind correctly).
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="bl-modal-overlay" onClick={() => !busy && onClose()}>
      <div
        className={`bl-modal${modalSize !== "default" ? ` bl-modal--${modalSize}` : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? subtitleId : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bl-modal-header">
          <div className="bl-modal-heading">
            <h2 id={titleId}>{title}</h2>
            {subtitle && (
              <p id={subtitleId} className="bl-modal-subtitle">
                {subtitle}
              </p>
            )}
          </div>
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
