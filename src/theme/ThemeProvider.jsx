import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ThemeContext,
  THEME_STORAGE_KEY,
  applyTheme,
  readSavedTheme,
  systemTheme,
  writeSavedTheme,
} from "./themeStore";

// One shared theme state for the whole app. See themeStore.js for the rules.
const ThemeProvider = ({ children }) => {
  const [saved, setSaved] = useState(readSavedTheme); // "light" | "dark" | null
  const [system, setSystem] = useState(systemTheme);

  const theme = saved || system;

  // Keep <html data-theme> in sync (index.html already set it before paint).
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Follow the OS setting live -- it only matters while nothing is saved.
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!query) return undefined;
    const onChange = (e) => setSystem(e.matches ? "dark" : "light");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Other tabs: a choice made in one tab applies to the rest immediately.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === THEME_STORAGE_KEY || e.key === null) setSaved(readSavedTheme());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // "light" | "dark" saves the choice; "system" clears it.
  const setPreference = useCallback((pref) => {
    const next = pref === "light" || pref === "dark" ? pref : null;
    writeSavedTheme(next);
    setSaved(next);
  }, []);

  const value = useMemo(
    () => ({ theme, preference: saved || "system", setPreference }),
    [theme, saved, setPreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
