import { LuKeyRound } from "react-icons/lu";

import "./ClientTable.css";

const ClientTable = ({ clients, status, search, onSearchChange, onEdit, onToggleStatus, onViewServices, onDelete, onResendSetPassword }) => {
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

                <td className="client-actions-cell">

                  <div className="client-actions">

                    <button
                      type="button"
                      className="edit-btn client-action client-action--edit"
                      onClick={() => onEdit(client)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="services-btn client-action client-action--services"
                      onClick={() => onViewServices(client)}
                    >
                      Services
                    </button>

                    {/* Only active clients can be sent a set-password link; the
                        button stays in place (disabled) so rows line up. */}
                    <button
                      type="button"
                      className="client-action client-action--icon"
                      onClick={() => onResendSetPassword(client)}
                      disabled={client.status !== "active"}
                      title={
                        client.status === "active"
                          ? "Resend set-password email"
                          : "Re-activate the account to send a set-password email"
                      }
                      aria-label={`Resend set-password email to ${client.displayName || client.email}`}
                    >
                      <LuKeyRound aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      className={`delete-btn client-action client-action--status is-${client.status}`}
                      onClick={() => onToggleStatus(client)}
                    >
                      {client.status === "active" ? "Disable" : "Activate"}
                    </button>

                    <button
                      type="button"
                      className="delete-btn client-delete-btn client-action client-action--delete"
                      onClick={() => onDelete(client)}
                      aria-label={`Delete ${client.displayName || client.email}`}
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

export default ClientTable;
