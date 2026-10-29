import AboutHero from "../components/About/AboutHero";
import MissionVision from "../components/About/MissionVision";
import OurProcess from "../components/About/OurProcess";
import OurStory from "../components/About/OurStory";
import CTA from "../components/Home/CTA/CTA";
import Footer from "../components/Home/Footer/Footer";
import WhyChoose from "../components/Home/WhyChoose/WhyChoose";
// About-only layout, scoped under .about-page (WhyChoose is shared with Home)
import "../components/About/AboutLayout.css";

const About = () => {
    return (
        <>
            <div className="about-page">
                <AboutHero />
                <OurStory />
                <MissionVision />
                <WhyChoose
                    tag="WHY CHOOSE US"
                    title="Why Businesses Trust"
                    highlight="Our Team"
                    description="We deliver innovative websites, digital marketing strategies, and technology solutions that help startups and businesses grow with confidence."
                    buttonText="Let's Work Together"
                />
                <OurProcess/>
            </div>
            <CTA
                tag="LET'S WORK TOGETHER"
                title="Ready to Grow Your Business"
                highlight="With D6?"
                description="Tell us about your goals and our team will recommend the right mix of web development, SEO, and digital marketing to help your business grow."
                primaryBtn="Get Free Consultation"
                secondaryBtn="Contact Us"
            />
            <Footer/>
        </>
    );
};

export default About;
