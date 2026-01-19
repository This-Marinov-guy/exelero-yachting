"use client";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";
import GridView from "@/components/commonComponents/gridView";

const Property3GridContainer = () => {
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type={"property"} gridSize={3} cardShow={9} view="image"/>
    </>
  );
};

export default Property3GridContainer;
