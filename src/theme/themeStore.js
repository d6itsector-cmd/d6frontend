import { createContext, useContext } from "react";

// Site-wide light/dark theme.
//
// - The resolved theme lives on <html data-theme="light|dark">; tokens.css
//   swaps every design token on that attribute, so public pages, the admin
//   portal and the client dashboard all change together.
// - A saved choice ("light" | "dark") wins. With no saved choice the system
//   preference (prefers-color-scheme) is used and followed live.
// - index.html applies the same rules inline before first paint (no flash
//   of the wrong theme); keep THEME_STORAGE_KEY in sync with that script.

export const THEME_STORAGE_KEY = "d6-theme";
export const THEMES = ["light", "dark"];

export const readSavedTheme = () => {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.includes(value) ? value : null;
  } catch {
    return null; // storage blocked (private mode etc.) -- fall back to system
  }
};

export const writeSavedTheme = (value) => {
  try {
    if (value) window.localStorage.setItem(THEME_STORAGE_KEY, value);
    else window.localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    // Not persisted, but the theme still applies for this page view.
  }
};

export const systemTheme = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const applyTheme = (theme) => {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  // Browser UI (mobile address bar) matches the page background.
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0B1220" : "#FFFFFF");
};

// { theme: "light"|"dark" (what is showing), preference: "light"|"dark"|"system",
//   setPreference(pref) }
export const ThemeContext = createContext({
  theme: "light",
  preference: "system",
  setPreference: () => {},
});

export const useTheme = () => useContext(ThemeContext);
