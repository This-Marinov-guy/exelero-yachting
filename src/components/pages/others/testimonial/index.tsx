'use client';
import Breadcrumbs from '@/components/commonComponents/breadcrumb';
import Testimonials from '@/components/themes/carDemo1/testimonials';
import CompanyLogo from '@/components/themes/jobDemo1/companyLogo';
import { RouteList } from '@/utils/RouteList';

const TestimonialContainer = () => {
  return (
    <>
      <Breadcrumbs title='Testimonial' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />
      <Testimonials type='testimonial'/>
      <CompanyLogo testimonial/>       
    </>
  )
}

export default TestimonialContainer
