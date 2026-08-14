import IndustryHero from "../components/Industries/IndustryHero";
import IndustryCategories from "../components/Industries/IndustryCategories";
import WhyChooseIndustry from "../components/Industries/WhyChooseIndustry";
import IndustryProcess from "../components/Industries/IndustryProcess";
import IndustryStats from "../components/Industries/IndustryStats";
import Footer from "../components/Home/Footer/Footer";
import CTA from "../components/Home/CTA/CTA";

const Industries = () => {
    return (
        <>
            <IndustryHero />
            <IndustryCategories />
            <WhyChooseIndustry />
            <IndustryProcess />
            <IndustryStats />
            <CTA
                badge="INDUSTRIES"
                title="Ready to Transform Your Business?"
                description="From startups to enterprises, we help businesses across industries achieve sustainable growth through customized digital marketing solutions."
            />
            <Footer />

        </>
    );
};

export default Industries;