import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeaturedArticle.css";
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

const FeaturedArticle = () => {
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | empty | error

  useEffect(() => {
    let cancelled = false;

    api
      .get("/blogs", { params: { featured: true, limit: 1 } })
      .then((res) => {
        if (cancelled) return;
        const [first] = res.data?.data || [];
        setBlog(first || null);
        setStatus(first ? "success" : "empty");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // No post is currently marked "featured" -- a legitimate content state
  // (LatestBlogs below already covers "no articles at all"), not an error,
  // so this section just doesn't render rather than showing empty chrome.
  if (status === "empty") {
    return null;
  }

  return (
    <section className="featured-article" id="articles">

      <div className="featured-header">

        <span>FEATURED ARTICLE</span>

        <h2>
          Discover Our Latest
          <br />
          Digital Marketing Insights
        </h2>

        <p>
          Explore expert strategies, industry trends, and practical
          tips to help your business grow online.
        </p>

      </div>

      {status === "loading" && <p className="status-message">Loading featured article...</p>}

      {status === "error" && (
        <p className="status-message">We couldn't load the featured article right now.</p>
      )}

      {status === "success" && <div className="featured-card">

        <div className="featured-image">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            loading="lazy"
          />
        </div>

        <div className="featured-content">

          <span className="category">
            {blog.category}
          </span>

          <h3>
            {blog.title}
          </h3>

          <p>
            {blog.excerpt}
          </p>

          <div className="blog-meta">

            <div>
              <FaCalendarAlt />
              <span>{formatDate(blog.publishedAt)}</span>
            </div>

          </div>

          <button onClick={() => navigate(`/blog/${blog.slug}`)}>
            Read Full Article
            <FaArrowRight />
          </button>

        </div>

      </div>}

    </section>
  );
};

export default FeaturedArticle;
