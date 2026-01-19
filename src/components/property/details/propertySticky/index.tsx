"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import PropertyDetail from "../../../commonComponents/productDetail/PropertyDetail";
const PropertyStickyContainer = () => {
  return (
    <>
      <Breadcrumbs title='Property Details' url={RouteList.Home.PropertyDemo1} />
      <PropertyDetail mainClass='detail-sticky-section' type='sticky' />
    </>
  );
};

export default PropertyStickyContainer;
