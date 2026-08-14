import { useState } from "react";
import "./BlogForm.css";
import api from "../../../services/api";

const CATEGORIES = ["SEO", "PPC", "Social Media Marketing", "Content Marketing", "Email Marketing", "Website Development", "Digital Strategy"];

// blog (optional) present => edit mode; absent => create mode. The backend
// auto-generates a unique slug from the title, so there's no slug field here.
const BlogForm = ({ blog, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: blog?.title || "",
    category: blog?.category || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    featuredImage: blog?.featuredImage || "",
    tags: (blog?.tags || []).join(", "),
    status: blog?.status || "draft",
    featured: blog?.featured || false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      category: form.category || undefined,
      excerpt: form.excerpt || undefined,
      content: form.content,
      featuredImage: form.featuredImage || undefined,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : undefined,
      status: form.status,
      featured: form.featured,
    };

    try {
      const res = blog
        ? await api.put(`/admin/blogs/${blog._id}`, payload)
        : await api.post("/admin/blogs", payload);
      onSaved(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save blog post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="blog-modal">

      <div className="blog-form">

        <div className="form-header">

          <h2>{blog ? "Edit Blog" : "Add Blog"}</h2>

          <button className="close-btn" onClick={onClose}>✕</button>

        </div>

        {error && <p className="form-error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Blog Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter Blog Title"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group full">
              <label>Featured Image URL</label>
              <input
                type="url"
                name="featuredImage"
                value={form.featuredImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group full">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="seo, google ads, strategy"
              />
            </div>

            <div className="form-group full">
              <label>Short Description</label>
              <textarea
                rows="3"
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Write a short description..."
              />
            </div>

            <div className="form-group full">
              <label>Blog Content</label>
              <textarea
                rows="8"
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your blog content..."
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                id="blog-featured"
              />
              <label htmlFor="blog-featured">Featured Blog</label>
            </div>

          </div>

          <div className="form-buttons">

            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Blog"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default BlogForm;
