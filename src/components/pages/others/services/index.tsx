"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import Testimonials from "@/components/themes/carDemo1/testimonials";
import { RouteList } from "@/utils/RouteList";
import MainService from "./MainService";
import Score from "./Score";

const ServicesContainer = () => {
  return (
    <>
      <Breadcrumbs title='Services' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />
      <MainService />
      <Score />
      <Testimonials service />
    </>
  );
};

export default ServicesContainer;
