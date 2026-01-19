"use client";
import GridView from "@/components/commonComponents/gridView";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";

const PropertyLeftListContainer = () => {
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type='property' sectionClass='property-list property-inner-section' gridType='list-view' gridSize={1} view="image"/>
    </>
  );
};

export default PropertyLeftListContainer;
