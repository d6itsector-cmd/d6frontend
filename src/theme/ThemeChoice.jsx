import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";

import "./ThemeChoice.css";
import { useTheme } from "./themeStore";

const OPTIONS = [
  { value: "light", label: "Light", icon: <FaSun aria-hidden="true" /> },
  { value: "dark", label: "Dark", icon: <FaMoon aria-hidden="true" /> },
  { value: "system", label: "System", icon: <FaDesktop aria-hidden="true" /> },
];

// Shared Light / Dark / System control (admin Settings and client Settings).
// Changes apply site-wide immediately and are remembered on this device.
const ThemeChoice = ({ name = "theme" }) => {
  const { theme, preference, setPreference } = useTheme();

  return (
    <div className="theme-choice">
      <div className="theme-choice-options" role="radiogroup" aria-label="Theme">
        {OPTIONS.map((opt) => (
          <label key={opt.value} className={`theme-choice-option ${preference === opt.value ? "is-selected" : ""}`}>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={preference === opt.value}
              onChange={() => setPreference(opt.value)}
            />
            {opt.icon}
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
      <p className="theme-choice-hint" aria-live="polite">
        {preference === "system"
          ? `Following your device setting (currently ${theme}).`
          : `${preference === "dark" ? "Dark" : "Light"} theme is on for this device.`}
      </p>
    </div>
  );
};

export default ThemeChoice;
