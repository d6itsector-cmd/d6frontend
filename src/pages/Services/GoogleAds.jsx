import GoogleAdsFAQ from "../../components/WebService/Google_Ads/GoogleAdsFAQ";
import GoogleAdsHero from "../../components/WebService/Google_Ads/GoogleAdsHero";
import GoogleAdsProcess from "../../components/WebService/Google_Ads/GoogleAdsProcess";
import GoogleAdsServices from "../../components/WebService/Google_Ads/GoogleAdsServices";
import WhyGoogleAds from "../../components/WebService/Google_Ads/WhyGoogleAds";
import CTA from "../../components/Home/CTA/CTA";
import Footer from "../../components/Home/Footer/Footer";

const GoogleAds = () => {
    return (
        <>
            <GoogleAdsHero />
            <WhyGoogleAds />
            <GoogleAdsServices />
            <GoogleAdsProcess />
            {/* <GoogleAdsFAQ/> */}
            <CTA
                tag="BOOST YOUR BUSINESS"
                title="Launch High-Performing"
                highlight="Google Ads Campaigns"
                description="Drive instant traffic, generate qualified leads, and scale your business with expertly managed Google Ads campaigns tailored to your goals."
                primaryButton="Start Your Campaign"
                secondaryButton="Book a Free Call"
            />
            <Footer/>
        </>
    );
};

export default GoogleAds;