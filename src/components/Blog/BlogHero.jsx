import "./BlogHero.css";
// Photography: Unsplash (Unsplash Licence), see src/assets/photos/CREDITS.md
import blogImage from "../../assets/photos/blog-hero.webp";
import { FaArrowRight, FaBookOpen } from "react-icons/fa";
import { useContact } from "../../context/ContactContext";

const BlogHero = () => {

  const { openContact } = useContact();

  return (
    <section className="blog-hero">

      <div className="blog-left">

        <span className="blog-badge">
          <FaBookOpen />
          BLOG & INSIGHTS
        </span>

        <h1>
          Learn,
          <span> Grow</span>
          <br />
          and Stay Ahead
        </h1>

        <p>
          Discover expert insights, practical tips, and the latest trends in
          SEO, Google Ads, Social Media Marketing, Website Development, and
          Digital Marketing to help your business grow online.
        </p>

        <div className="blog-buttons">

          <a href="#articles" className="primary-btn">
            Explore Articles
          </a>

          <button
            className="secondary-btn"
            onClick={openContact}
          >
            Contact Us
            <FaArrowRight />
          </button>

        </div>

        <div className="blog-stats">

          <div>
            <h3>100+</h3>
            <span>Articles</span>
          </div>

          <div>
            <h3>10+</h3>
            <span>Categories</span>
          </div>

          <div>
            <h3>Weekly</h3>
            <span>Updates</span>
          </div>

        </div>

      </div>

      <div className="blog-right">

        <img
          src={blogImage}
          alt="Laptop, notepad and coffee on a desk ready for writing"
          width="1200"
          height="900"
          loading="lazy"
        />

      </div>

    </section>
  );
};

export default BlogHero;