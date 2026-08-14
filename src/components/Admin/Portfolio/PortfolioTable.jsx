import "./PortfolioTable.css";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23EEF2F7'/%3E%3C/svg%3E";

const PortfolioTable = ({ items, status, search, onSearchChange, onEdit, onDelete }) => {
  return (
    <div className="portfolio-table-card">

      <div className="table-top">
        <input
          type="text"
          className="search-input"
          placeholder="Search Portfolio..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {status === "loading" && <p className="table-status-msg">Loading portfolio items...</p>}
      {status === "error" && <p className="table-status-msg">We couldn't load the portfolio right now.</p>}
      {status === "success" && items.length === 0 && (
        <p className="table-status-msg">No portfolio items yet. Click "+ Add Portfolio" to showcase your first project.</p>
      )}

      {status === "success" && items.length > 0 && (
        <table className="portfolio-table">

          <thead>
            <tr>
              <th>Image</th>
              <th>Project</th>
              <th>Client</th>
              <th>Industry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.title}
                    className="project-image"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                  />
                </td>
                <td>{item.title}</td>
                <td>{item.clientName || "-"}</td>
                <td>{item.industry || "-"}</td>
                <td>
                  <span className={`status ${item.status}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => onEdit(item)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => onDelete(item)}>
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

export default PortfolioTable;
