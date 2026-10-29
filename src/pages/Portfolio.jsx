import PortfolioHero from "../components/Portfolio/PortfolioHero";
import FeaturedProjects from "../components/Portfolio/FeaturedProjects";
import PortfolioStats from "../components/Portfolio/PortfolioStats";
import Testimonials from "../components/Portfolio/Testimonials";
import CTA from "../components/Home/CTA/CTA";
import Footer from "../components/Home/Footer/Footer";
// Shared layout for the marketing pages, scoped under .site-page
import "../styles/sitePages.css";

const Portfolio = () => {
  return (
    <>
      <div className="site-page site-page--portfolio">
        <PortfolioHero />

        <FeaturedProjects />

        <PortfolioStats />

        <Testimonials />
      </div>

      <CTA
        badge="OUR PORTFOLIO"
        title="Ready to Start Your Success Story?"
        description="Whether you're launching a new brand, redesigning your website, or scaling your digital marketing, D6 Global Services is here to help you achieve measurable business growth."
        primaryBtn="Get Free Consultation"
        secondaryBtn="Contact Us"
      />
      <Footer/>
    </>
  );
};

export default Portfolio;