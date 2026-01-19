"use client";
import GridView from "@/components/commonComponents/gridView";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";

const PropertyVideoListContainer = () => {
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type='property' view='video' sectionClass='property-list property-list-video property-inner-section' gridType='list-view' gridSize={1} />
    </>
  );
};

export default PropertyVideoListContainer;
