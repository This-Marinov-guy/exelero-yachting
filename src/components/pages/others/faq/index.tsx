"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import NewsLetter from "@/components/themes/jobDemo1/newsLetter";
import { RouteList } from "@/utils/RouteList";
import FaqMain from "./FaqMain";
import FaqAnswer from "./FaqAnswer";

const FaqContainer = () => {
  return (
    <>
      <Breadcrumbs title='FAQ' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />
      <FaqMain />
      <NewsLetter mainClass='car-newsletter' />
      <FaqAnswer/>
    </>
  );
};

export default FaqContainer;
