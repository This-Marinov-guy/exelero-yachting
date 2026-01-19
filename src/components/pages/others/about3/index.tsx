"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import Car2Testimonial from "@/components/themes/carDemo2/car2Testimonial";
import ServiceSection from "@/components/themes/carDemo2/service";
import StepBooking from "@/components/themes/carDemo2/stepBooking";
import { RouteList } from "@/utils/RouteList";
import React from "react";
import TeamAbout from "./TeamAbout";

const About3Container = () => {
  return (
    <>
      <Breadcrumbs title='About' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image/>
      <ServiceSection about />
      <StepBooking/>
      <Car2Testimonial about/>
      <TeamAbout/>
    </>
  );
};

export default About3Container;
