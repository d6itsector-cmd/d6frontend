import { useEffect } from "react";

// Re-reads billing state when the client comes back to the tab (e.g. after
// paying on Stripe Checkout in another tab), and every `pollMs` while
// `polling` is true and the tab is visible -- payment status is only ever
// changed by the backend's Stripe webhook, so the page has to ask again.
export const useRefreshOnReturn = (reload, { polling = false, pollMs = 30_000 } = {}) => {
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") reload();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [reload]);

  useEffect(() => {
    if (!polling) return undefined;
    const t = setInterval(() => {
      if (document.visibilityState === "visible") reload();
    }, pollMs);
    return () => clearInterval(t);
  }, [polling, pollMs, reload]);
};
