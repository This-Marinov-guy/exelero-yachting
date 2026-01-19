import React, { Fragment, useEffect } from "react";
import Property1HomeSection from "./property1HomeSection";
import { useAppDispatch } from "@/redux/hooks";
import { fetchCategoryApiData, fetchProductApiData } from "@/redux/reducers/ProductSlice";
import FeaturesProperty from "./featuresProperty";
import Property1About from "./property1About";
import Categories from "../common/category";
import Property1Service from "./property1Service";
import Discovery from "./discovery";
import Achievements from "./achievements";
import PropertyTestimonial from "./propertyTestimonial";
import PropertyNewsLetter from "./propertyNewsLetter";

const PropertyDemo1Container = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductApiData());
    dispatch(fetchCategoryApiData());
  }, [dispatch]);
  return (
    <Fragment>
      <Property1HomeSection />
      <FeaturesProperty/>
      <Property1About/>
      <Categories type="property-1"/>
      <Property1Service/>
      <Discovery/>
      <Achievements/>
      <PropertyTestimonial/>
      <PropertyNewsLetter/>
    </Fragment>
  );
};

export default PropertyDemo1Container;
