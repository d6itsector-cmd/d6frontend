const ToastStack = ({ toasts, onDismiss }) => (
  <div className="bl-toasts" aria-live="polite">
    {toasts.map((t) => (
      <div key={t.id} className={`bl-toast bl-toast--${t.tone}`} role={t.tone === "error" ? "alert" : "status"}>
        <span>{t.message}</span>
        <button type="button" onClick={() => onDismiss(t.id)} aria-label="Dismiss">
          ✕
        </button>
      </div>
    ))}
  </div>
);

export default ToastStack;
