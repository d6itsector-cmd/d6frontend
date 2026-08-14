import "./BlogTable.css";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

const BlogTable = ({ blogs, status, search, onSearchChange, onEdit, onDelete }) => {
  return (
    <div className="blog-table-card">

      <div className="table-top">
        <input
          type="text"
          placeholder="Search blogs..."
          className="search-input"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {status === "loading" && <p className="table-status-msg">Loading blogs...</p>}
      {status === "error" && <p className="table-status-msg">We couldn't load blogs right now.</p>}
      {status === "success" && blogs.length === 0 && (
        <p className="table-status-msg">No blog posts yet. Click "+ Add Blog" to publish your first one.</p>
      )}

      {status === "success" && blogs.length > 0 && (
        <table className="blog-table">

          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td>{blog.title}</td>
                <td>{blog.category || "-"}</td>
                <td>{formatDate(blog.createdAt)}</td>
                <td>
                  <span className={`status ${blog.status}`}>
                    {blog.status}
                  </span>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => onEdit(blog)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(blog)}>
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

export default BlogTable;
