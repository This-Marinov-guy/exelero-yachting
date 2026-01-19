"use client";
import CarBreadCrumb from "../../common/CarBreadcrumb";
import CarDetail from "@/components/commonComponents/productDetail/CarDetails";

const CarClassicContainers = () => {
  return (
    <>
      <CarBreadCrumb />
      <CarDetail type='car' detailImages />
    </>
  );
};

export default CarClassicContainers;
