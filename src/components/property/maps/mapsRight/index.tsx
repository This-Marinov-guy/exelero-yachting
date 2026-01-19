"use client";
import GridView from "@/components/commonComponents/gridView";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";

const MapsRightContainer = () => {
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type={"property"} side='nosidebar' mapSide='right' map cardShow={4} />
    </>
  );
};

export default MapsRightContainer;
