import "./ConsultationView.css";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";

const ConsultationView = ({ consultation, onClose }) => {
  if (!consultation) return null;

  return (
    <div className="consultation-overlay">

      <div className="consultation-card">

        <div className="consultation-header">

          <h2>Consultation Details</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <div className="consultation-body">

          <p><strong>Name:</strong> {consultation.name}</p>

          <p><strong>Company:</strong> {consultation.company || "-"}</p>

          <p><strong>Email:</strong> {consultation.email}</p>

          <p><strong>Phone:</strong> {consultation.phone}</p>

          <p><strong>Service:</strong> {consultation.service}</p>

          <p><strong>Budget:</strong> {consultation.budget || "-"}</p>

          <p><strong>Preferred Contact Method:</strong> {consultation.preferredContactMethod || "-"}</p>

          <p><strong>Submitted:</strong> {formatDate(consultation.createdAt)}</p>

          <p><strong>Status:</strong> {consultation.status}</p>

          <h4>Message</h4>

          <div className="message-box">

            {consultation.message || "No message provided."}

          </div>

        </div>

        <div className="consultation-footer">

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConsultationView;
