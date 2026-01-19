"use client";
import React from "react";
import CarBreadCrumb from "../../common/CarBreadcrumb";
import CarDetail from "@/components/commonComponents/productDetail/CarDetails";

const CarSliderContainer = () => {
  return (
    <>
      <CarBreadCrumb detailImages type='car-image-slider' mainClass='style-breadcrumbs-2' />
      <CarDetail type='car' />
    </>
  );
};

export default CarSliderContainer;
