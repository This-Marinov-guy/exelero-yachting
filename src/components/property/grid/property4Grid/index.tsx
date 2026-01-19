"use client";
import GridView from "@/components/commonComponents/gridView";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";

const Property4GridContainer = () => {
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type={"property"} gridSize={4} cardShow={12} />
    </>
  );
};

export default Property4GridContainer;
