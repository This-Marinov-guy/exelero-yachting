'use client';
import GridView from "@/components/commonComponents/gridView";
import { JobTitle } from "@/constants";
import { RouteList } from "@/utils/RouteList";
import JobBreadcrumb from "../../common/JobBreadcrumb";

const JobFullListContainer = () => {
  return (
    <>
      <JobBreadcrumb title={JobTitle} subTitle={JobTitle} url={RouteList.Home.JobDemo1} />
      <GridView type='job' sectionClass='job-list-section full-padding section-b-space' filterClass='job-sidebar' detailBoxStyle="style-4" tagClass='job-list-header' gridSize={2} fluid />
    </>
  );
};

export default JobFullListContainer;
