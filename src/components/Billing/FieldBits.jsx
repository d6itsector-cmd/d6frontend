import { FaExclamationCircle } from "react-icons/fa";

// Small shared pieces for the sectioned billing forms (Create plan,
// Create payment request).

export const RequiredMark = () => (
  <span className="bl-required" aria-hidden="true">
    *
  </span>
);

export const FieldError = ({ id, message }) =>
  message ? (
    <p id={id} className="bl-inline-error">
      <FaExclamationCircle aria-hidden="true" />
      <span>{message}</span>
    </p>
  ) : null;
