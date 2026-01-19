"use client";
import React from "react";
import JobBreadcrumb from "../../common/JobBreadcrumb";
import GridView from "@/components/commonComponents/gridView";
import { JobTitle } from "@/constants";
import { RouteList } from "@/utils/RouteList";

const JobListStyle2Container = () => {
  return (
    <>
      <JobBreadcrumb title={JobTitle} subTitle={JobTitle} url={RouteList.Home.JobDemo1} />
      <GridView type='job' sectionClass='job-list-section section-b-space' filterClass='job-sidebar' side='nosidebar' topFilter  tagClass='job-list-header' detailBoxStyle='style-4' gridSize={2}/>
    </>
  );
};

export default JobListStyle2Container;
