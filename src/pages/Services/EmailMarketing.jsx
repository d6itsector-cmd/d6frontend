import EmailHero from "../../components/WebService/EmailMarketing/EmailHero";
import EmailProcess from "../../components/WebService/EmailMarketing/EmailProcess";
import EmailServices from "../../components/WebService/EmailMarketing/EmailServices";
import WhyEmailMarketing from "../../components/WebService/EmailMarketing/WhyEmailMarketing";
import CTA from "../../components/Home/CTA/CTA";
import Footer from "../../components/Home/Footer/Footer";
// Shared, .svc-detail-scoped layout for the five service detail pages.
import "../../components/WebService/ServiceDetailLayout.css";
// <EmailFAQ/> is disabled below; keep its stylesheet loaded since its global
// .faq-* / .section-tag rules also apply to other components.
import "../../components/WebService/EmailMarketing/EmailFAQ.css";

const EmailMarketing = () => {
  return (
    <>
      <div className="svc-detail">
        <EmailHero />
        <WhyEmailMarketing/>
        <EmailServices/>
        <EmailProcess/>
      </div>
      {/* <EmailFAQ/> */}
      <CTA
        tag="LET'S GROW YOUR BUSINESS"
        title="Ready to Launch High-Converting"
        highlight="Email Campaigns?"
        description="Connect with your audience through personalized email marketing strategies that increase engagement, build customer loyalty, and drive measurable business growth."
        primaryBtn="Get Free Consultation"
        secondaryBtn="Contact Us"
      />
      <Footer/>
    </>
  );
};

export default EmailMarketing;
