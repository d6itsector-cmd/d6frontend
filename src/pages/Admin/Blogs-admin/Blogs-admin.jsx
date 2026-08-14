import { useEffect, useState } from "react";
import "./Blogs-admin.css";

import BlogTable from "../../../components/Admin/Blogs/BlogTable";
import BlogForm from "../../../components/Admin/Blogs/BlogForm";
import api from "../../../services/api";

const BlogsAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const loadBlogs = () => {
    setStatus("loading");
    api
      .get("/admin/blogs", { params: { limit: 50, search: search || undefined } })
      .then((res) => {
        setBlogs(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    const t = setTimeout(loadBlogs, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (blog) => {
    if (!window.confirm(`Delete blog post "${blog.title}"?`)) return;
    try {
      await api.delete(`/admin/blogs/${blog._id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== blog._id));
    } catch (err) {
      window.alert(err.response?.data?.message || "Unable to delete this blog post.");
    }
  };

  const handleSaved = (saved) => {
    setBlogs((prev) => {
      const exists = prev.some((b) => b._id === saved._id);
      return exists ? prev.map((b) => (b._id === saved._id ? saved : b)) : [saved, ...prev];
    });
    setShowForm(false);
    setEditingBlog(null);
  };

  return (
    <div className="blogs-page">

      <div className="blogs-header">

        <div>
          <h1>Blog Management</h1>
          <p>Manage all blogs published on your website.</p>
        </div>

        <button
          className="add-blog-btn"
          onClick={() => setShowForm(true)}
        >
          + Add Blog
        </button>

      </div>

      <BlogTable
        blogs={blogs}
        status={status}
        search={search}
        onSearchChange={setSearch}
        onEdit={setEditingBlog}
        onDelete={handleDelete}
      />

      {showForm && (
        <BlogForm
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {editingBlog && (
        <BlogForm
          blog={editingBlog}
          onClose={() => setEditingBlog(null)}
          onSaved={handleSaved}
        />
      )}

    </div>
  );
};

export default BlogsAdmin;
