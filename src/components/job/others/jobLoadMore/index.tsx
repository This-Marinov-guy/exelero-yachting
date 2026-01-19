"use client";
import React from "react";
import JobBreadcrumb from "../../common/JobBreadcrumb";
import GridView from "@/components/commonComponents/gridView";
import { JobTitle } from "@/constants";
import { RouteList } from "@/utils/RouteList";

const JobLoadMoreContainer = () => {
  return (
    <>
      <JobBreadcrumb title={JobTitle} subTitle={JobTitle} url={RouteList.Home.JobDemo1} />
      <GridView type='job' sectionClass='job-grid-section section-b-space' filterClass='job-sidebar' tagClass='job-list-header' cardShow={4} scrollType='load-more' />
    </>
  );
};

export default JobLoadMoreContainer;
