'use client';
import React from 'react'
import CarBreadCrumb from '../../common/CarBreadcrumb';
import CarDetail from '@/components/commonComponents/productDetail/CarDetails';
import VideoModal from '@/components/commonComponents/modal/VideoModal';

const CarClassicSliderContainer = () => {
  return (
    <>
      <CarBreadCrumb />
      <CarDetail type='car' classicSlider />
      <VideoModal />
    </>
  )
}

export default CarClassicSliderContainer