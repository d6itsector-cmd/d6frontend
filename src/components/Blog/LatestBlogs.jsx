import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LatestBlogs.css";
import {
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";

import api from "../../services/api";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const LatestBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    let cancelled = false;

    api
      .get("/blogs", { params: { limit: 6 } })
      .then((res) => {
        if (cancelled) return;
        setBlogs(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="latest-blogs">

      <div className="latest-header">

        <span>LATEST ARTICLES</span>

        <h2>
          Explore Our Latest
          <br />
          Blog Posts
        </h2>

        <p>
          Stay informed with expert articles covering SEO, paid
          advertising, social media, branding, web development,
          and the latest digital marketing trends.
        </p>

      </div>

      {status === "loading" && <p className="blogs-status">Loading articles...</p>}

      {status === "error" && (
        <p className="blogs-status">
          We couldn't load articles right now. Please try again shortly.
        </p>
      )}

      {status === "success" && blogs.length === 0 && (
        <p className="blogs-status">No articles published yet.</p>
      )}

      {status === "success" && blogs.length > 0 && (
        <div className="blogs-grid">

          {blogs.map((blog) => (

            <div className="blog-card" key={blog._id}>

              <span className="blog-category">
                {blog.category}
              </span>

              <h3>{blog.title}</h3>

              <p>{blog.excerpt}</p>

              <div className="blog-info">

                <div>
                  <FaCalendarAlt />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>

              </div>

              <button onClick={() => navigate(`/blog/${blog.slug}`)}>
                Read More
                <FaArrowRight />
              </button>

            </div>

          ))}

        </div>
      )}

    </section>
  );
};

export default LatestBlogs;
