import SocialHero from "../../components/WebService/SocialMedia/SocialHero";
import SocialProcess from "../../components/WebService/SocialMedia/SocialProcess";
import SocialServices from "../../components/WebService/SocialMedia/SocialServices";
import WhySocialMedia from "../../components/WebService/SocialMedia/WhySocialMedia";
import CTA from "../../components/Home/CTA/CTA";
import Footer from "../../components/Home/Footer/Footer";
import SocialFAQ from "../../components/WebService/SocialMedia/SocialFAQ";

const SocialMedia = () => {
    return (
        <>
            <SocialHero />
            <WhySocialMedia />
            <SocialServices />
            <SocialProcess />
            {/* <SocialFAQ/> */}
            <CTA
                tag="LET'S CONNECT"
                title="Grow Your Brand"
                highlight="On Social Media"
                description="Build meaningful relationships with your audience and increase engagement through strategic social media marketing."
                primaryButton="Start Your Campaign"
                secondaryButton="Talk to an Expert"
            />
            <Footer/>
        </>
    );
};

export default SocialMedia;