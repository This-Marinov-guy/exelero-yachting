import React, { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchCategoryApiData, fetchProductApiData } from "@/redux/reducers/ProductSlice";
import { FeaturedProperties, RecentlyAddedProperties } from "@/constants";
import SearchModal from "@/components/commonComponents/modal/SearchModal";
import Property2HomeSection from "./property2HomeSection";
import Categories from "../common/category";
import FeaturedProperty from "./featuredProperty";
import Experience from "./experience";
import OurService from "./ourService";
import ExploreByCity from "./exploreByCity";
import Counter from "./counter";
import Testimonial from "./testimonial";
import Team from "./team";

const PropertyDemo2Container = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductApiData());
    dispatch(fetchCategoryApiData());
  }, [dispatch]);
  return (
    <>
      <Property2HomeSection />
      <Categories type='property-2' />
      <FeaturedProperty title={FeaturedProperties} data={[41, 42, 43]} label='Featured' />
      <Experience />
      <FeaturedProperty title={RecentlyAddedProperties} data={[44, 45, 46]} label='New' />
      <OurService />
      <ExploreByCity />
      <Counter />
      <Testimonial />
      <Team />
      <SearchModal type="property" />
    </>
  );
};

export default PropertyDemo2Container;
