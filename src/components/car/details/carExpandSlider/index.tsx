"use client";
import React from "react";
import CarBreadCrumb from "../../common/CarBreadcrumb";
import CarDetail from "@/components/commonComponents/productDetail/CarDetails";

const CarExpandSliderContainer = () => {
  return (
    <>
      <CarBreadCrumb detailImages type='expand-slider' mainClass='style-breadcrumbs-2' />
      <CarDetail type='car' />
    </>
  );
};

export default CarExpandSliderContainer;
