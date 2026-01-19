"use client";
import React from "react";
import CarBreadCrumb from "../../common/CarBreadcrumb";
import CarDetail from "@/components/commonComponents/productDetail/CarDetails";

const CarScrollspyContainer = () => {
  return (
    <>
      <CarBreadCrumb />
      <CarDetail type='car' detailImages scrollspy />
    </>
  );
};

export default CarScrollspyContainer;
