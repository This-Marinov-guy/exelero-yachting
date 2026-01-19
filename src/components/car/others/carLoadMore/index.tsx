"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import GridView from "@/components/commonComponents/gridView";
import { RouteList } from "@/utils/RouteList";
import React from "react";

const CarLoadMoreContainer = () => {
  return (
    <>
      <Breadcrumbs mainClass='car-breadcrumbs-section' title='Car Shop' url={RouteList.Home.CarDemo1} />
      <GridView type={"car"} scrollType='load-more' sectionClass='car-shop-section car-product-section' filterClass='filter-sidebar' gridSize={3} tagClass='car-list-header' />
    </>
  );
};

export default CarLoadMoreContainer;
