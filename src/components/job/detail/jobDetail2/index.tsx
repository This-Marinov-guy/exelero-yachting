'use client';
import React from 'react'
import JobDetailBreadcrumb from '../../common/JobDetailBreadcrumb';
import JobDetail from '@/components/commonComponents/productDetail/JobDetail';

const JobDetail2Container = () => {
  return (
    <>
      <JobDetailBreadcrumb detailType={'detail-2'}/>
      <JobDetail detailType={'detail-2'}/>
    </>
  )
}

export default JobDetail2Container