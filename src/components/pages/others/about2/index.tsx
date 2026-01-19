"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import AboutService from "./AboutService";
import WelcomeSection from "./WelcomeSection";
import Testimonials from "@/components/themes/carDemo1/testimonials";

const About2Container = () => {
  return (
    <>
      <Breadcrumbs title='About' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image/>
      <WelcomeSection />
      <AboutService />
      <Testimonials/>
    </>
  );
};

export default About2Container;
