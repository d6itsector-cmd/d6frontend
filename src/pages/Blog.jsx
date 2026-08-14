import BlogHero from "../components/Blog/BlogHero";
import FeaturedArticle from "../components/Blog/FeaturedArticle";
import BlogCategories from "../components/Blog/BlogCategories";
import LatestBlogs from "../components/Blog/LatestBlogs";
import Newsletter from "../components/Blog/Newsletter";

import CTA from "../components/Home/CTA/CTA";
import Footer from "../components/Home/Footer/Footer";

const Blog = () => {
  return (
    <>
      <BlogHero />

      <FeaturedArticle />

      <BlogCategories />

      <LatestBlogs />

      <Newsletter />

      <CTA
        badge="DIGITAL MARKETING INSIGHTS"
        title="Ready to Grow Your Business?"
        description="Stay ahead with expert digital marketing strategies, actionable insights, and innovative solutions that help your business succeed online."
        primaryButton="Get Free Consultation"
        secondaryButton="Get In Touch"
      />

      <Footer />
    </>
  );
};

export default Blog;