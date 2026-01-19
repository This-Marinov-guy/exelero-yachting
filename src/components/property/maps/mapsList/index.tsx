"use client";
import GridView from "@/components/commonComponents/gridView";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";

const MapListContainer = () => {
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type={"property"} side='nosidebar' sectionClass='property-list property-inner-section' gridType='list-view' gridSize={1} map cardShow={4} />
    </>
  );
};

export default MapListContainer;
