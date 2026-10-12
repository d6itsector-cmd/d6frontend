import "./ConsultationTable.css";

const STATUSES = ["new", "contacted", "scheduled", "completed", "cancelled"];

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";

const ConsultationTable = ({ consultations, status, search, onSearchChange, onView, onStatusChange, onDelete }) => {
  return (
    <div className="consultation-table-container">

      <div className="table-header">
        <input
          type="text"
          placeholder="Search Consultation..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {status === "loading" && <p className="table-status-msg">Loading consultations...</p>}

      {status === "error" && (
        <p className="table-status-msg">We couldn't load consultations right now.</p>
      )}

      {status === "success" && consultations.length === 0 && (
        <p className="table-status-msg">No consultation requests found.</p>
      )}

      {status === "success" && consultations.length > 0 && (
        <table className="consultation-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Service</th>
              <th>Budget</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {consultations.map((item) => (

              <tr key={item._id}>

                <td>{item.name}</td>

                <td>{item.company || "-"}</td>

                <td>{item.service}</td>

                <td>{item.budget || "-"}</td>

                <td>{formatDate(item.createdAt)}</td>

                <td>
                  <span className={`status ${item.status}`}>
                    {item.status}
                  </span>
                </td>

                <td className="consultation-actions-cell">

                  {/* Own class names: .view-btn / .delete-btn are defined globally by
                      several other screens and would otherwise leak in here. */}
                  <div className="consultation-actions">

                    <button
                      type="button"
                      className="consultation-action consultation-action--view"
                      onClick={() => onView(item)}
                    >
                      View
                    </button>

                    <select
                      className="consultation-action consultation-action--status"
                      aria-label={`Status for ${item.name}`}
                      value={item.status}
                      onChange={(e) => onStatusChange(item, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="consultation-action consultation-action--delete"
                      onClick={() => onDelete(item)}
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>
      )}

    </div>
  );
};

export default ConsultationTable;
