'use client';
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import PricingCard from "./PricingCard";
import NewsLetter from "@/components/themes/jobDemo1/newsLetter";

const PricingContainer = () => {
  return (
    <>
      <Breadcrumbs title='Team' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />
      <PricingCard />
      <NewsLetter mainClass='car-newsletter'/>
    </>
  );
};

export default PricingContainer;
