"use client";
import GridView from "@/components/commonComponents/gridView";
import { JobTitle } from "@/constants";
import { RouteList } from "@/utils/RouteList";
import JobBreadcrumb from "../../common/JobBreadcrumb";

const JobFilterContainer = () => {
  return (
    <>
      <JobBreadcrumb title={JobTitle} subTitle={JobTitle} url={RouteList.Home.JobDemo1} />
      <GridView type='job' sectionClass='job-grid-section section-b-space' filterClass='job-sidebar' tagClass='job-list-header' tagFilter/>
    </>
  );
};

export default JobFilterContainer;
