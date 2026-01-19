'use client';
import React from 'react'
import { RouteList } from '@/utils/RouteList'
import { JobTitle } from '@/constants'
import GridView from "@/components/commonComponents/gridView";
import JobBreadcrumb from '../../common/JobBreadcrumb';

const JobGridProgressContainer = () => {
  return (
    <>
        <JobBreadcrumb title={JobTitle} subTitle={JobTitle} url={RouteList.Home.JobDemo1}/>
        <GridView type='job' sectionClass='job-grid-section section-b-space' filterClass='job-sidebar' tagClass='job-list-header'detailBoxStyle="style-progress" />
    </>
  )
}

export default JobGridProgressContainer