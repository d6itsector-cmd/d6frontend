import "./ProjectTable.css";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

const ProjectTable = ({ projects, status, search, onSearchChange, onEdit, onDelete }) => {
  return (
    <div className="project-table-container">
      <div className="table-header">
        <input
          type="text"
          placeholder="Search project..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {status === "loading" && <p className="table-status-msg">Loading projects...</p>}

      {status === "error" && <p className="table-status-msg">We couldn't load projects right now.</p>}

      {status === "success" && projects.length === 0 && (
        <p className="table-status-msg">No projects found.</p>
      )}

      {status === "success" && projects.length > 0 && (
        <table className="project-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Service</th>
              <th>Progress</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>{project.name}</td>
                <td>{project.client?.displayName || project.client?.email || "-"}</td>
                <td>{project.service || "-"}</td>
                <td>{project.progress ?? 0}%</td>
                <td>{formatDate(project.dueDate)}</td>

                <td>
                  <span className={`status ${project.status}`}>
                    {project.status}
                  </span>
                </td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => onEdit(project)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(project)}
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

export default ProjectTable;
