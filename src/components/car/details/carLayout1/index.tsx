"use client";
import React from "react";
import CarBreadCrumb from "../../common/CarBreadcrumb";
import CarDetail from "@/components/commonComponents/productDetail/CarDetails";

const CarLayout1Container = () => {
  return (
    <>
      <CarBreadCrumb type="car-detail" detailImages mainClass='style-breadcrumbs-2' />
      <CarDetail type='car' />
    </>
  );
};

export default CarLayout1Container;
