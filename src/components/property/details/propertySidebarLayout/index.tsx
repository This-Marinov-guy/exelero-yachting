"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import PropertyDetail from "../../../commonComponents/productDetail/PropertyDetail";

const SidebarLayoutContainer = () => {
  return (
    <>
      <Breadcrumbs title='Property Details' url={RouteList.Home.PropertyDemo1} />
      <PropertyDetail mainClass='property-sidebar-section section-t-space ratio_30' type='sidebar-layout' />
    </>
  );
};

export default SidebarLayoutContainer;
