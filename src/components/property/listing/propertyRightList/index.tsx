"use client";
import GridView from "@/components/commonComponents/gridView";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";

const PropertyRightListContainer = () => {
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type='property' sectionClass='property-list property-inner-section' side='right' gridType='list-view' gridSize={1} />
    </>
  );
};

export default PropertyRightListContainer;
