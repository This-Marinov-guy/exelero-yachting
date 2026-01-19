'use client';
import React from 'react'
import JobBreadcrumb from '../../common/JobBreadcrumb';
import GridView from "@/components/commonComponents/gridView";
import { RouteList } from '@/utils/RouteList';
import { JobTitle } from '@/constants';

const JobGrid2Container = () => {
  return (
    <>
      <JobBreadcrumb title={JobTitle} subTitle={JobTitle} url={RouteList.Home.JobDemo1} />
      <GridView type='job' sectionClass='job-grid-section section-b-space' filterClass='job-sidebar' tagClass='job-list-header' />
    </>
  )
}

export default JobGrid2Container