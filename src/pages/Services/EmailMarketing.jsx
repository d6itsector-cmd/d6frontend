import EmailHero from "../../components/WebService/EmailMarketing/EmailHero";
import EmailProcess from "../../components/WebService/EmailMarketing/EmailProcess";
import EmailServices from "../../components/WebService/EmailMarketing/EmailServices";
import WhyEmailMarketing from "../../components/WebService/EmailMarketing/WhyEmailMarketing";
import CTA from "../../components/Home/CTA/CTA";
import Footer from "../../components/Home/Footer/Footer";
import EmailFAQ from "../../components/WebService/EmailMarketing/EmailFAQ";

const EmailMarketing = () => {
  return (
    <>
      <EmailHero />
      <WhyEmailMarketing/>
      <EmailServices/>
      <EmailProcess/>
      {/* <EmailFAQ/> */}
      <CTA
        tag="LET'S GROW YOUR BUSINESS"
        title="Ready to Launch High-Converting"
        highlight="Email Campaigns?"
        description="Connect with your audience through personalized email marketing strategies that increase engagement, build customer loyalty, and drive measurable business growth."
        primaryButton="Get Free Consultation"
        secondaryButton="Contact Us"
      />
      <Footer/>
    </>
  );
};

export default EmailMarketing;