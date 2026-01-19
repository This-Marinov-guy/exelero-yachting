'use client';
import React from 'react'
import JobBreadcrumb from '../../common/JobBreadcrumb'
import GridView from '@/components/commonComponents/gridView'
import { JobTitle } from '@/constants'
import { RouteList } from '@/utils/RouteList'

const JobLeftListContainer = () => {
  return (
    <>
      <JobBreadcrumb title={JobTitle} subTitle={JobTitle} url={RouteList.Home.JobDemo1} />
      <GridView type='job' sectionClass='job-list-section section-b-space' filterClass='job-sidebar' tagClass='job-list-header' detailBoxStyle='style-4' gridSize={1} cardShow={9} />
    </>
  )
}

export default JobLeftListContainer