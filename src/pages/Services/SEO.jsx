import Footer from "../../components/Home/Footer/Footer";
// Shared, .svc-detail-scoped layout for the five service detail pages.
import "../../components/WebService/ServiceDetailLayout.css";
import Hero from "../../components/WebService/SEO/SeoHero";
import SEOProcess from "../../components/WebService/SEO/SEOProcess";
import SEOServices from "../../components/WebService/SEO/SEOServices";
import WhySEO from "../../components/WebService/SEO/WhySEO";
import CTA from "../../components/Home/CTA/CTA";
// <SEOFAQ/> is disabled below; keep its stylesheet loaded since its global
// .faq-* / .section-tag rules also apply to other components.
import "../../components/WebService/SEO/SEOFAQ.css";
// import Footer from ""

const SEO = () => {
    return (
        <>
            <div className="svc-detail">
                <Hero />
                <WhySEO />
                <SEOServices />
                <SEOProcess />
            </div>
            {/* <SEOFAQ/> */}
            <CTA
                tag="LET'S GROW TOGETHER"
                title="Ready to Grow Your Business"
                highlight="with SEO?"
                description="Increase your online visibility, attract more qualified leads, and achieve sustainable business growth with our expert SEO services."
                primaryBtn="Get Free Consultation"
                secondaryBtn="Contact Us"
            />
            <Footer />
        </>
    );
};

export default SEO;
