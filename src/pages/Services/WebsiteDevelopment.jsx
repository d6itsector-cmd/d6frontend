import WebsiteFAQ from "../../components/WebService/WebsiteDevelopment/WebsiteFAQ";
import WebsiteHero from "../../components/WebService/WebsiteDevelopment/WebsiteHero";
import WebsiteProcess from "../../components/WebService/WebsiteDevelopment/WebsiteProcess";
import WebsiteServices from "../../components/WebService/WebsiteDevelopment/WebsiteServices";
import WhyWebsite from "../../components/WebService/WebsiteDevelopment/WhyWebsite";
import CTA from "../../components/Home/CTA/CTA";
import Footer from "../../components/Home/Footer/Footer";

const WebsiteDevelopment = () => {
  return (
    <>
      <WebsiteHero />
      <WhyWebsite/>
      <WebsiteServices/>
      <WebsiteProcess/>
      {/* <WebsiteFAQ/> */}
      <CTA
        tag="WEBSITE DEVELOPMENT"
        title="Ready to Build Your"
        highlight="Business Website?"
        description="Transform your ideas into a modern, responsive, and high-performing website. Our expert developers create SEO-friendly, secure, and scalable websites that help your business grow online."
        primaryButton="Get Free Consultation"
        secondaryButton="View Our Portfolio"
      />
      <Footer/>

    </>
  );
};

export default WebsiteDevelopment;