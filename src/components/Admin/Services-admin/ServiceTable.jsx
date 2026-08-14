import "./ServiceTable.css";

const ServiceTable = ({ services, status, search, onSearchChange, onEdit, onDelete }) => {
  return (
    <div className="service-table-card">

      <div className="table-top">
        <input
          type="text"
          placeholder="Search service..."
          className="search-input"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {status === "loading" && <p className="table-status-msg">Loading services...</p>}
      {status === "error" && <p className="table-status-msg">We couldn't load services right now.</p>}
      {status === "success" && services.length === 0 && (
        <p className="table-status-msg">No services yet. Click "+ Add Service" to create your first one.</p>
      )}

      {status === "success" && services.length > 0 && (
        <table className="service-table">

          <thead>
            <tr>
              <th>Service</th>
              <th>Description</th>
              <th>Sort Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td>{service.title}</td>
                <td>{service.shortDescription || "-"}</td>
                <td>{service.sortOrder ?? 0}</td>
                <td>
                  <span className={`status ${service.status}`}>
                    {service.status}
                  </span>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => onEdit(service)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(service)}>
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

export default ServiceTable;
