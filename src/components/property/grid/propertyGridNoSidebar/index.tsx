"use client";
import GridView from "@/components/commonComponents/gridView";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";

const PropertyGridNoSidebarContainer = () => {
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type={"property"} side='nosidebar' gridSize={3} topFilter />
    </>
  );
};

export default PropertyGridNoSidebarContainer;
