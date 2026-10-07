// Shown by the route guards when GET /api/auth/me fails. The role is then
// unknown, so guessing a portal (the old behaviour sent everyone to the
// client dashboard) would be wrong -- especially for admins.
const AccessCheckError = () => (
  <div className="status-message" role="alert" style={{ padding: "80px 20px" }}>
    <p>We couldn't verify your account access right now. Please check your connection and try again.</p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      style={{
        marginTop: 16,
        padding: "10px 20px",
        borderRadius: "var(--radius-sm)",
        border: "none",
        background: "var(--accent)",
        color: "var(--white)",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Try again
    </button>
  </div>
);

export default AccessCheckError;
