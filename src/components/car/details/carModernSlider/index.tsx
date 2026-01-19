'use client';
import React from 'react'
import CarBreadCrumb from '../../common/CarBreadcrumb'
import CarDetail from '@/components/commonComponents/productDetail/CarDetails'

const CarModernSliderContainer = () => {
  return (
    <>
      <CarBreadCrumb modern mainClass='car-home-section' />
      <CarDetail type='car' />
    </>
  )
}

export default CarModernSliderContainer