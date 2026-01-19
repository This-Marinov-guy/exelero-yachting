"use client";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import TopFilter from "../../../commonComponents/TopFilter";
import GridView from "@/components/commonComponents/gridView";

const Property2GridContainer = () => {   
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type={"property"}  />
    </>
  );
};

export default Property2GridContainer;
