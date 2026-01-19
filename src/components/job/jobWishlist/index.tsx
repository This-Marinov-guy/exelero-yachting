'use client';
import { JobTitle } from '@/constants'
import { RouteList } from '@/utils/RouteList'
import React from 'react'
import JobBreadcrumb from '../common/JobBreadcrumb'
import WishListContent from '@/components/property/propertyWishlist/WishlistContent'

const JobWishlistContainer = () => {
    
  return (
    <>
      <JobBreadcrumb title={JobTitle} subTitle={JobTitle} url={RouteList.Home.JobDemo1} />
      <WishListContent type='job' />
    </>
  )
}

export default JobWishlistContainer