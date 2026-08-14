import "./ThemeSettings.css";

const ThemeSettings = () => {
  return (
    <div className="settings-card">

      <h2>Theme</h2>

      <div className="toggle-group">

        <label>
          <input
            type="radio"
            name="theme"
            defaultChecked
          />
          Light Theme
        </label>

        <label>
          <input
            type="radio"
            name="theme"
          />
          Dark Theme
        </label>

      </div>

    </div>
  );
};

export default ThemeSettings;