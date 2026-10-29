// <GoogleAdsFAQ/> is disabled below; keep its stylesheet loaded since its global
// .faq-* / .section-tag rules also apply to other components.
import "../../components/WebService/Google_Ads/GoogleAdsFAQ.css";
import GoogleAdsHero from "../../components/WebService/Google_Ads/GoogleAdsHero";
import GoogleAdsProcess from "../../components/WebService/Google_Ads/GoogleAdsProcess";
import GoogleAdsServices from "../../components/WebService/Google_Ads/GoogleAdsServices";
import WhyGoogleAds from "../../components/WebService/Google_Ads/WhyGoogleAds";
import CTA from "../../components/Home/CTA/CTA";
import Footer from "../../components/Home/Footer/Footer";
// Shared, .svc-detail-scoped layout for the five service detail pages.
import "../../components/WebService/ServiceDetailLayout.css";

const GoogleAds = () => {
    return (
        <>
            <div className="svc-detail">
                <GoogleAdsHero />
                <WhyGoogleAds />
                <GoogleAdsServices />
                <GoogleAdsProcess />
            </div>
            {/* <GoogleAdsFAQ/> */}
            <CTA
                tag="BOOST YOUR BUSINESS"
                title="Launch High-Performing"
                highlight="Google Ads Campaigns"
                description="Drive instant traffic, generate qualified leads, and scale your business with expertly managed Google Ads campaigns tailored to your goals."
                primaryBtn="Start Your Campaign"
                secondaryBtn="Book a Free Call"
            />
            <Footer/>
        </>
    );
};

export default GoogleAds;
