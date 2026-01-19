"use client";
import React from "react";
import TopFilter from "../../../commonComponents/TopFilter";
import PropertyBreadcrumb from "../../../commonComponents/PropertyBreadcrumb";
import GridView from "@/components/commonComponents/gridView";

const MapsLeftContainer = () => {
  
  return (
    <>
      <TopFilter />
      <PropertyBreadcrumb />
      <GridView type={"property"} side="nosidebar" map cardShow={4}/>
    </>
  );
};

export default MapsLeftContainer;
