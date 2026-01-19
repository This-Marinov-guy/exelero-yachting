"use client";
import GridView from "@/components/commonComponents/gridView";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";

const PropertyThumbListContainer = () => {
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type='property' view='multiple' sectionClass='property-list property-thumb-section property-inner-section' gridType='list-view' gridSize={1} />
    </>
  );
};

export default PropertyThumbListContainer;
