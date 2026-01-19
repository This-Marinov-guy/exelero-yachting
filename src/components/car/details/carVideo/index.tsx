import React from 'react'
import CarBreadCrumb from '../../common/CarBreadcrumb'
import CarDetail from '@/components/commonComponents/productDetail/CarDetails'

const CarVideoContainer = () => {
  return (
    <>
      <CarBreadCrumb detailImages type='car-video' mainClass='video-breadcrumbs' />
      <CarDetail type='car' />
    </>
  )
}

export default CarVideoContainer