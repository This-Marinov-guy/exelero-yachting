'use client';
import React from 'react'
import JobBreadcrumb from '../../common/JobBreadcrumb'
import GridView from '@/components/commonComponents/gridView'
import { JobTitle } from '@/constants'
import { RouteList } from '@/utils/RouteList'

const JobGridType3Container = () => {
  return (
    <>
      <JobBreadcrumb title={JobTitle} subTitle={JobTitle} url={RouteList.Home.JobDemo1} />
      <GridView type='job' sectionClass='job-grid-section section-b-space' filterClass='job-sidebar' tagClass='job-list-header' detailBoxStyle="style-3" gridSize={3} cardShow={12}/>
    </>
  )
}

export default JobGridType3Container