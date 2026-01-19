"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import GridView from "@/components/commonComponents/gridView";
import { RouteList } from "@/utils/RouteList";
import React from "react";

const CarNoSidebarContainer = () => {
  return (
    <>
      <Breadcrumbs mainClass='car-breadcrumbs-section' title='Car Shop' url={RouteList.Home.CarDemo1} />
      <GridView type={"car"} sectionClass='car-shop-section car-product-section' filterClass='filter-sidebar' side='nosidebar' gridSize={3} cardShow={9} tagClass='car-list-header' topFilter/>
    </>
  );
};

export default CarNoSidebarContainer;
