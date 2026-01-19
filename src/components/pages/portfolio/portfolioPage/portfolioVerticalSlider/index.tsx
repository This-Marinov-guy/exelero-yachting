"use client";
import { ImagePath } from "@/constants";
import { PortfolioBoxSlider } from "@/data/pages/Portfolio";
import { dynamicNumber } from "@/utils";
import RatioImage from "@/utils/RatioImage";
import { Swiper, SwiperSlide } from "swiper/react";

const PortfolioVerticalSliderContainer = () => {
  return (
    <section className='portfolio-section portfolio-parallax-section p-0'>
        <Swiper {...PortfolioBoxSlider} mousewheel={true} direction={'vertical'} className='portfolio-vertical-slider'>
          {dynamicNumber(5).map((src, i) => {
            return (
              <SwiperSlide key={i}>
                <div className='portfolio-vertical-image'>
                  <RatioImage src={`${ImagePath}/portfolio/full-img/${src}.jpg`} alt='slider-img' className='img-fluid' />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>        
    </section>
  );
};

export default PortfolioVerticalSliderContainer;
