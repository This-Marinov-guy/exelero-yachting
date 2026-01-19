'use client';
import React from 'react'
import JobBreadcrumb from '../../common/JobBreadcrumb';
import { JobTitle } from '@/constants';
import { RouteList } from '@/utils/RouteList';
import GridView from "@/components/commonComponents/gridView";

const JobRightListContainer = () => {
  return (
    <>
      <JobBreadcrumb title={JobTitle} subTitle={JobTitle} url={RouteList.Home.JobDemo1} />
      <GridView type='job' sectionClass='job-list-section section-b-space' filterClass='job-sidebar' tagClass='job-list-header' detailBoxStyle='style-4' side='right' gridSize={1} cardShow={9} />
    </>
  )
}

export default JobRightListContainer