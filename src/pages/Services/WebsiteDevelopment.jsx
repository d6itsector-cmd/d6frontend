// <WebsiteFAQ/> is disabled below; keep its stylesheet loaded since its global
// .faq-* / .section-tag rules also apply to other components.
import "../../components/WebService/WebsiteDevelopment/WebsiteFAQ.css";
import WebsiteHero from "../../components/WebService/WebsiteDevelopment/WebsiteHero";
import WebsiteProcess from "../../components/WebService/WebsiteDevelopment/WebsiteProcess";
import WebsiteServices from "../../components/WebService/WebsiteDevelopment/WebsiteServices";
import WhyWebsite from "../../components/WebService/WebsiteDevelopment/WhyWebsite";
import CTA from "../../components/Home/CTA/CTA";
import Footer from "../../components/Home/Footer/Footer";
// Shared, .svc-detail-scoped layout for the five service detail pages.
import "../../components/WebService/ServiceDetailLayout.css";

const WebsiteDevelopment = () => {
  return (
    <>
      <div className="svc-detail">
        <WebsiteHero />
        <WhyWebsite/>
        <WebsiteServices/>
        <WebsiteProcess/>
      </div>
      {/* <WebsiteFAQ/> */}
      <CTA
        tag="WEBSITE DEVELOPMENT"
        title="Ready to Build Your"
        highlight="Business Website?"
        description="Transform your ideas into a modern, responsive, and high-performing website. Our expert developers create SEO-friendly, secure, and scalable websites that help your business grow online."
        primaryBtn="Get Free Consultation"
        secondaryBtn="Contact Us"
      />
      <Footer/>

    </>
  );
};

export default WebsiteDevelopment;
