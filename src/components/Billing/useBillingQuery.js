import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// Loads `fetcher()` whenever `key` changes or reload() is called, ignoring
// responses that arrive after a newer request started. Status is derived
// from whether the latest result matches the current request, so no state
// is set synchronously inside the effect.
//
// @template T
// @param {() => Promise<T>} fetcher
// @param {string} key  serialised inputs (filters, page) -- refetches on change
export const useBillingQuery = (fetcher, key = "") => {
  const fetcherRef = useRef(fetcher);
  useLayoutEffect(() => {
    fetcherRef.current = fetcher;
  });

  const [version, setVersion] = useState(0);
  const requestKey = `${key}#${version}`;
  const [result, setResult] = useState({ key: null, status: "loading", data: undefined, error: null });

  useEffect(() => {
    let cancelled = false;
    fetcherRef.current()
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, status: "success", data, error: null });
      })
      .catch((error) => {
        if (!cancelled) setResult((prev) => ({ key: requestKey, status: "error", data: prev.data, error }));
      });
    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const status = result.key === requestKey ? result.status : "loading";

  return { status, data: result.data, error: status === "error" ? result.error : null, reload };
};
