"use client";
import GridView from "@/components/commonComponents/gridView";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";

const PropertyLoadMoreContainer = () => {
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type={"property"} gridSize={3} scrollType='load-more' />
    </>
  );
};

export default PropertyLoadMoreContainer;
