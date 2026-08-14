import "./ClientTable.css";

const ClientTable = ({ clients, status, search, onSearchChange, onEdit, onToggleStatus, onViewServices }) => {
  return (
    <div className="client-table-container">

      <div className="table-header">

        <input
          type="text"
          placeholder="Search client..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

      </div>

      {status === "loading" && <p className="table-status-msg">Loading clients...</p>}

      {status === "error" && (
        <p className="table-status-msg">We couldn't load clients right now.</p>
      )}

      {status === "success" && clients.length === 0 && (
        <p className="table-status-msg">No clients found.</p>
      )}

      {status === "success" && clients.length > 0 && (
        <table className="client-table">

          <thead>

            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {clients.map((client) => (
              <tr key={client._id}>

                <td>{client.displayName || "(no name set)"}</td>

                <td>{client.profile?.companyName || "-"}</td>

                <td>{client.email}</td>

                <td>{client.profile?.phone || "-"}</td>

                <td>

                  <span className={`status ${client.status}`}>
                    {client.status}
                  </span>

                </td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() => onEdit(client)}
                  >
                    Edit
                  </button>

                  <button
                    className="services-btn"
                    onClick={() => onViewServices(client)}
                  >
                    Services
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onToggleStatus(client)}
                  >
                    {client.status === "active" ? "Disable" : "Activate"}
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

export default ClientTable;
