import Hero from "../components/Home/Hero/Hero";
import About from "../components/Home/AboutSection/AboutSection";
import Services from "../components/Home/Services/Services";
import WhyChoose from "../components/Home/WhyChoose/WhyChoose";
import Process from "../components/Home/Process/Process";
import Industries from "../components/Home/Industries/Industries";
import FAQ from "../components/Home/FAQ/FAQ";
import CTA from "../components/Home/CTA/CTA";
import Footer from "../components/Home/Footer/Footer";


const Home = () => {
  return (
    <>
      <Hero />
      <About />
       <Services />
       <WhyChoose/>
       <Process/>
       <Industries/>
       <FAQ/>
       <CTA/>
       <Footer/>
    </>
  );
};

export default Home;