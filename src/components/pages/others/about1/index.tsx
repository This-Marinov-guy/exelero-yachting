"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import About from "@/components/themes/carDemo1/about";
import JobReview from "@/components/themes/jobDemo1/jobReview";
import { RouteList } from "@/utils/RouteList";
import BrowseCategory from "./BrowseCategory";

const About1Container = () => {
  return (
    <>
      <Breadcrumbs title='About' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image/>
      <About header />
      <BrowseCategory />
      <JobReview />
    </>
  );
};

export default About1Container;
