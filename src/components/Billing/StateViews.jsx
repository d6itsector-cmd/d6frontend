export const LoadingState = ({ message = "Loading..." }) => (
  <div className="bl-state" role="status">
    <span className="bl-spinner" aria-hidden="true" />
    <p>{message}</p>
  </div>
);

export const EmptyState = ({ title, message, children }) => (
  <div className="bl-state bl-state--empty">
    {title && <h3>{title}</h3>}
    {message && <p>{message}</p>}
    {children}
  </div>
);

export const ErrorState = ({ message = "We couldn't load this right now.", onRetry }) => (
  <div className="bl-state bl-state--error" role="alert">
    <p>{message}</p>
    {onRetry && (
      <button type="button" className="bl-btn bl-btn--ghost" onClick={onRetry}>
        Try again
      </button>
    )}
  </div>
);
