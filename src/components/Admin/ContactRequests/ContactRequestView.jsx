import "./ContactRequestView.css";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";

// mailto: rather than an in-app reply -- contact-form visitors aren't
// registered clients (no Message model applies to them), so the real
// "reply" channel is email, same as the Reply-To header already set on the
// admin notification for this request.
const buildReplyHref = (request) => {
  const subject = `Re: ${request.subject || "Your inquiry to D6 Global Media"}`;
  const quoted = request.message
    ? `\n\n---\nOn ${new Date(request.createdAt).toLocaleDateString("en-GB")}, ${request.name} wrote:\n${request.message}`
    : "";
  const body = `Hi ${request.name},${quoted}`;
  return `mailto:${request.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const ContactRequestView = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <div className="contact-view-overlay">

      <div className="contact-view-card">

        <div className="contact-view-header">

          <h2>Contact Request Details</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <div className="contact-view-body">

          <div className="info-grid">

            <div className="info-item">
              <label>Name</label>
              <p>{request.name}</p>
            </div>

            <div className="info-item">
              <label>Email</label>
              <p>{request.email}</p>
            </div>

            <div className="info-item">
              <label>Phone</label>
              <p>{request.phone || "-"}</p>
            </div>

            <div className="info-item">
              <label>Subject</label>
              <p>{request.subject || "-"}</p>
            </div>

            <div className="info-item">
              <label>Status</label>

              <span className={`status-badge ${request.status}`}>
                {request.status}
              </span>

            </div>

            <div className="info-item">
              <label>Date</label>
              <p>{formatDate(request.createdAt)}</p>
            </div>

          </div>

          <div className="message-box">

            <label>Message</label>

            <div className="message-content">
              {request.message}
            </div>

          </div>

        </div>

        <div className="contact-footer">

          <p className="reply-note">
            To update this request's status, use the Leads page (this same inquiry appears there).
          </p>

          <div className="contact-footer-actions">

            <a
              className="reply-btn"
              href={buildReplyHref(request)}
            >
              Reply by Email
            </a>

            <button
              className="close-modal-btn"
              onClick={onClose}
            >
              Close
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ContactRequestView;
