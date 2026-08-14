import "./LeadTable.css";

const STATUSES = ["new", "contacted", "closed"];

const LeadTable = ({ leads, status, search, onSearchChange, onStatusChange, onDelete }) => {
  return (
    <div className="project-table-container">

      <div className="table-header">
        <input
          type="text"
          placeholder="Search Lead..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {status === "loading" && <p className="table-status-msg">Loading leads...</p>}

      {status === "error" && <p className="table-status-msg">We couldn't load leads right now.</p>}

      {status === "success" && leads.length === 0 && (
        <p className="table-status-msg">No leads found.</p>
      )}

      {status === "success" && leads.length > 0 && (
        <table className="project-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Subject</th>
              <th>Source</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {leads.map((lead) => (

              <tr key={lead._id}>

                <td>{lead.name}</td>

                <td>{lead.company || "-"}</td>

                <td>{lead.subject || "-"}</td>

                <td>{lead.source}</td>

                <td>{lead.phone || "-"}</td>

                <td>

                  <span className={`lead-status ${lead.status}`}>
                    {lead.status}
                  </span>

                </td>

                <td>

                  <select
                    className="lead-status-select"
                    value={lead.status}
                    onChange={(e) => onStatusChange(lead, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(lead)}
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

export default LeadTable;
