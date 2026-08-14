import Footer from "../../components/Home/Footer/Footer";
import Hero from "../../components/WebService/SEO/SeoHero";
import SEOProcess from "../../components/WebService/SEO/SEOProcess";
import SEOServices from "../../components/WebService/SEO/SEOServices";
import WhySEO from "../../components/WebService/SEO/WhySEO";
import CTA from "../../components/Home/CTA/CTA";
import SEOFAQ from "../../components/WebService/SEO/SEOFAQ";
// import Footer from ""

const SEO = () => {
    return (
        <>
            <Hero />
            <WhySEO />
            <SEOServices />
            <SEOProcess />
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