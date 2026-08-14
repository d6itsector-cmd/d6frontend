import AboutHero from "../components/About/AboutHero";
import MissionVision from "../components/About/MissionVision";
import OurProcess from "../components/About/OurProcess";
import OurStory from "../components/About/OurStory";
import Footer from "../components/Home/Footer/Footer";
import WhyChoose from "../components/Home/WhyChoose/WhyChoose";

const About = () => {
    return (
        <>
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
            <Footer/>
        </>
    );
};

export default About;