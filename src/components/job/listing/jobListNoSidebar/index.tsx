'use client';
import React from 'react'
import JobBreadcrumb from '../../common/JobBreadcrumb'
import GridView from '@/components/commonComponents/gridView'
import { JobTitle } from '@/constants'
import { RouteList } from '@/utils/RouteList'

const JobListNoSidebarContainer = () => {
  return (
    <>
      <JobBreadcrumb title={JobTitle} subTitle={JobTitle} url={RouteList.Home.JobDemo1} />
      <GridView type='job' sectionClass='job-list-section section-b-space' filterClass='job-sidebar' tagClass='job-list-header' detailBoxStyle='style-4' side='nosidebar' gridSize={1} cardShow={9} topFilter/>
    </>
  )
}

export default JobListNoSidebarContainer