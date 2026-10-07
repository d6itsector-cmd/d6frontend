import BillingModal from "./BillingModal";

const ConfirmationModal = ({
  title,
  message,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Go back",
  danger = false,
  busy = false,
  error = "",
  onConfirm,
  onClose,
}) => (
  <BillingModal
    title={title}
    onClose={onClose}
    busy={busy}
    footer={
      <>
        <button type="button" className="bl-btn bl-btn--ghost" onClick={onClose} disabled={busy}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`bl-btn ${danger ? "bl-btn--danger" : "bl-btn--primary"}`}
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? "Working..." : confirmLabel}
        </button>
      </>
    }
  >
    {message && <p className="bl-confirm-message">{message}</p>}
    {children}
    {error && <p className="bl-form-error">{error}</p>}
  </BillingModal>
);

export default ConfirmationModal;
