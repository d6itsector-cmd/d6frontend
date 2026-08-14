import "./ContactRequestTable.css";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";

const ContactRequestTable = ({ requests, status, search, onSearchChange, onView, onDelete }) => {
  return (
    <div className="contact-table-container">

      <div className="table-header">
        <input
          type="text"
          placeholder="Search request..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {status === "loading" && <p className="table-status-msg">Loading contact requests...</p>}

      {status === "error" && (
        <p className="table-status-msg">We couldn't load contact requests right now.</p>
      )}

      {status === "success" && requests.length === 0 && (
        <p className="table-status-msg">No contact requests found.</p>
      )}

      {status === "success" && requests.length > 0 && (
        <table className="contact-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {requests.map((request) => (
              <tr key={request._id}>

                <td>{request.name}</td>

                <td>{request.email}</td>

                <td>{request.phone || "-"}</td>

                <td>{request.subject || "-"}</td>

                <td>
                  <span className={`request-status ${request.status}`}>
                    {request.status}
                  </span>
                </td>

                <td>{formatDate(request.createdAt)}</td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() => onView(request)}
                  >
                    View
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(request)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      )}

    </div>
  );
};

export default ContactRequestTable;
