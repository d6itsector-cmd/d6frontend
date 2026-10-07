import { useCallback, useEffect, useRef, useState } from "react";

// The project has no global toast system; billing screens keep their own
// short-lived stack (render it with <ToastStack />).
export const useToasts = () => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  /** @param {"success"|"error"|"info"|"warning"} tone */
  const push = useCallback(
    (tone, message) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, tone, message }]);
      timers.current.set(id, setTimeout(() => dismiss(id), tone === "error" ? 8000 : 6000));
    },
    [dismiss]
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => clearTimeout(t));
  }, []);

  return { toasts, push, dismiss };
};
