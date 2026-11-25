import React from "react";
import Header from "../Components/landing/Header";
import Banner from "../Components/landing/Banner";
import Testimonials from "../Components/Testimonios/Testimonials";
import CallToAction from "../Components/CallToAction/CallToAction";
import FAQ from "../Components/landing/FAQ";
import Footer from "../Components/landing/Footer";
import BenefitsSection from "../Components/landing/BenefitsSection";
import ServicesSection from "../Components/landing/ServicesSection";
import InfoSection from "../Components/landing/InfoSection";

const LandingPage = () => {
  return (
    <>
      <Header />
      <Banner />
      <ServicesSection/>
      <InfoSection />
      <BenefitsSection />
      <Testimonials />
      <FAQ />
      <CallToAction />
      <Footer />
    </>
  );
};

export default LandingPage;
