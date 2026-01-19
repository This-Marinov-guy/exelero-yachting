"use client";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";
import ParallaxCard from "./parallaxCard";

const PropertyParallaxContainer = () => {
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <ParallaxCard />
    </>
  );
};

export default PropertyParallaxContainer;