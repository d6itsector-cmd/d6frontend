import { Link } from "react-router-dom";
import "./BlogCategories.css";
import {
  FaSearch,
  FaBullhorn,
  FaHashtag,
  FaPenNib,
  FaEnvelope,
  FaLaptopCode,
  FaChartLine,
} from "react-icons/fa";

// Matches the real category set used in Admin -> Blogs (BlogForm.jsx's
// CATEGORIES list) rather than an unrelated made-up list, since these are
// meant to represent actual published content.
const categories = [
  { icon: <FaSearch />, title: "SEO" },
  { icon: <FaBullhorn />, title: "PPC" },
  { icon: <FaHashtag />, title: "Social Media Marketing" },
  { icon: <FaPenNib />, title: "Content Marketing" },
  { icon: <FaEnvelope />, title: "Email Marketing" },
  { icon: <FaLaptopCode />, title: "Website Development" },
  { icon: <FaChartLine />, title: "Digital Strategy" },
];

const BlogCategories = () => {
  return (
    <section className="blog-categories">

      <div className="categories-header">

        <span>CATEGORIES</span>

        <h2>
          Explore Topics That
          <br />
          Matter to Your Business
        </h2>

        <p>
          Browse our collection of articles covering every aspect of
          digital marketing to help your business grow online.
        </p>

      </div>

      <div className="categories-grid">

        {categories.map((category) => (

          <Link className="category-card" to="/blog" key={category.title}>

            <div className="category-icon">
              {category.icon}
            </div>

            <h3>{category.title}</h3>

          </Link>

        ))}

      </div>

    </section>
  );
};

export default BlogCategories;
