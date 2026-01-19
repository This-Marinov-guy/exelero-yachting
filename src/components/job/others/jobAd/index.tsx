'use client';
import { JobTitle } from '@/constants';
import React from 'react'
import JobBreadcrumb from '../../common/JobBreadcrumb';
import { RouteList } from '@/utils/RouteList';
import GridView from "@/components/commonComponents/gridView";

const JobAdContainer = () => {
  return (
    <>
      <JobBreadcrumb title={JobTitle} subTitle={JobTitle} url={RouteList.Home.JobDemo1} />
      <GridView type='job' sectionClass='job-list-section section-b-space' filterClass='job-sidebar' tagClass='job-list-header' detailBoxStyle='job-ads' gridSize={1} cardShow={8}  />
    </>
  )
}

export default JobAdContainer