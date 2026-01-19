import { AboutSliderTitle, ImagePath, SVGPath } from "@/constants";
import { AboutSliderContentData, JobSliderSetting, JobTestimonials } from "@/data/demo/jobDemo1";
import { dynamicNumber } from "@/utils";
import SvgIcon from "@/utils/SvgIcon";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import Image from "next/image";
import React from "react";
import { Container } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import CommonHeader from "../../common/CommonHeader";

const JobReview = () => {
  return (
    <section className='about-slider-section section-b-space'>
      <Container>        
        <CommonHeader title={AboutSliderTitle} content={AboutSliderContentData} headClass="title-style-3 text-center" />
        <Swiper {...JobSliderSetting} className='about-job-slider'>
          {JobTestimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className='about-slider-content'>
                <Image width={93} height={76} src={`${SVGPath}/job/quote.svg`} alt='quote' className='img-fluid quote-img' />
                <p>{item.quote}</p>
                <ul className='about-rating-list'>
                  {dynamicNumber(5).map((_, i) => (
                    <li key={i}>
                      <SvgIcon iconId="property/sprite/star.svg#star-svg"/>                      
                    </li>
                  ))}
                </ul>
                <div className='profile-flex'>
                  <Image height={60} width={60} src={`${ImagePath}${item.imgSrc}`} alt={item.name} className='img-fluid' unoptimized/>
                  <div>
                    <h4>{item.name}</h4>
                    <h6>{item.position}</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className='swiper-flex car-arrow'>
            <div className='swiper-button-prev job-about-prev'>
            <ArrowLeft2 size={24} color="white" className="iconsax"/>
            </div>
            <div className='swiper-button-next job-about-next'>
            <ArrowRight2 size={24} color="white" className="iconsax"/>
            </div>
          </div>
        </Swiper>
      </Container>
    </section>
  );
};

export default JobReview;
