// Calls onClose when Escape is pressed on `target`. Returns the cleanup
// function that removes the listener (use it as a useEffect cleanup).
export const escapeToClose = (target, onClose) => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  target.addEventListener("keydown", handleKeyDown);
  return () => target.removeEventListener("keydown", handleKeyDown);
};
