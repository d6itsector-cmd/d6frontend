import PortfolioHero from "../components/Portfolio/PortfolioHero";
import FeaturedProjects from "../components/Portfolio/FeaturedProjects";
import PortfolioStats from "../components/Portfolio/PortfolioStats";
import Testimonials from "../components/Portfolio/Testimonials";
import CTA from "../components/Home/CTA/CTA";
import Footer from "../components/Home/Footer/Footer";

const Portfolio = () => {
  return (
    <>
      <PortfolioHero />

      <FeaturedProjects />

      <PortfolioStats />

      <Testimonials />

      <CTA
        badge="OUR PORTFOLIO"
        title="Ready to Start Your Success Story?"
        description="Whether you're launching a new brand, redesigning your website, or scaling your digital marketing, D6 Global Media is here to help you achieve measurable business growth."
        primaryButton="Get Free Consultation"
        secondaryButton="Contact Us"
      />
      <Footer/>
    </>
  );
};

export default Portfolio;