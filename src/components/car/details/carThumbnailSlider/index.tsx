"use client";
import React from "react";
import CarBreadCrumb from "../../common/CarBreadcrumb";
import CarDetail from "@/components/commonComponents/productDetail/CarDetails";
import { Container } from "reactstrap";
import BreadCrumbMainDetail from "../../common/BreadcrumbMainDetail";

const CarThumbnailSliderContainer = () => {
  return (
    <>
      <CarBreadCrumb type='car-thumbnail' detailImages />
      <div className='car-detail-section half-breadcrumbs'>
        <Container>
          <BreadCrumbMainDetail />
        </Container>
      </div>
      <CarDetail type='car' />
    </>
  );
};

export default CarThumbnailSliderContainer;
