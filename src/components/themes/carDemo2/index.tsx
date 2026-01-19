import React, { useEffect } from "react";
import Car2HomeSection from "./car2HomeSection";
import LogoSection from "../common/LogoSection";
import AboutUs from "./aboutUs";
import Categories from "../common/category";
import { useAppDispatch } from "@/redux/hooks";
import { fetchCategoryApiData, fetchProductApiData } from "@/redux/reducers/ProductSlice";
import FeaturesCar from "./featuresCar";
import StepBooking from "./stepBooking";
import ServiceSection from "./service";
import BlogSection from "./blog";
import Car2Testimonial from "./car2Testimonial";
import Instagram from "./car2Testimonial/Instagram";

const CarDemo2Container = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductApiData());
    dispatch(fetchCategoryApiData());
  }, [dispatch]);
  return (
    <>
      <Car2HomeSection />
      <LogoSection swiperClass='logo-car2-slider' sectionClass='section-t-lg-space' />
      <AboutUs />
      <Categories type="carDemo-2"/>
      <FeaturesCar/>
      <StepBooking/>
      <ServiceSection/>
      <BlogSection/>
      <Car2Testimonial/>
      <Instagram/>
    </>
  );
};

export default CarDemo2Container;
