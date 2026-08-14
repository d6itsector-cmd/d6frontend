import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCalendarAlt, FaUser, FaArrowLeft } from "react-icons/fa";

import "./BlogDetail.css";
import Footer from "../components/Home/Footer/Footer";
import api from "../services/api";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const BlogDetail = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | notFound | error

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setBlog(null);

    api
      .get(`/blogs/${slug}`)
      .then((res) => {
        if (cancelled) return;
        setBlog(res.data?.data || null);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus(err.response?.status === 404 ? "notFound" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <section className="blog-detail">

      <div className="blog-detail-container">

        <Link to="/blog" className="back-link">
          <FaArrowLeft /> Back to Blog
        </Link>

        {status === "loading" && <p className="blog-detail-status">Loading article...</p>}

        {status === "notFound" && (
          <p className="blog-detail-status">
            This article doesn't exist or is no longer available.
          </p>
        )}

        {status === "error" && (
          <p className="blog-detail-status">
            We couldn't load this article right now. Please try again shortly.
          </p>
        )}

        {status === "success" && blog && (
          <article className="blog-detail-article">

            {blog.category && <span className="category">{blog.category}</span>}

            <h1>{blog.title}</h1>

            <div className="blog-meta">

              {blog.author?.displayName && (
                <div>
                  <FaUser />
                  <span>{blog.author.displayName}</span>
                </div>
              )}

              {blog.publishedAt && (
                <div>
                  <FaCalendarAlt />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
              )}

            </div>

            {blog.featuredImage && (
              <div className="blog-detail-image">
                <img src={blog.featuredImage} alt={blog.title} loading="lazy" />
              </div>
            )}

            <div className="blog-detail-content">{blog.content}</div>

            {blog.tags?.length > 0 && (
              <div className="blog-tags">
                {blog.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            )}

          </article>
        )}

      </div>

      <Footer />

    </section>
  );
};

export default BlogDetail;
