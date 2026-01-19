"use client";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";
import GridView from "@/components/commonComponents/gridView";

const Property2RightGridContainer = () => {
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type={"property"} side='right' />
    </>
  );
};

export default Property2RightGridContainer;
