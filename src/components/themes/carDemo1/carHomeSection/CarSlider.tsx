"use client";
import { ImagePath } from "@/constants";
import { CarSliderData, CarSliderNav } from "@/data/demo/demo1";
import { dynamicNumber } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

const CarSlider = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  return (
    <div className="home-img-slider">
      <Swiper className="car-slider-main" {...CarSliderData} thumbs={{ swiper: thumbsSwiper }}>
        {dynamicNumber(3).map((item, index) => (
          <SwiperSlide key={index}>
            <div className="main-car-img">
              <Image alt="Home banner" width={1114} height={343} src={`${ImagePath}/car/home-img/${item}.png`} className="img-fluid" unoptimized />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper className="car-slider" {...CarSliderNav} onSwiper={setThumbsSwiper}>
        {dynamicNumber(3).map((item, index) => (
          <SwiperSlide key={index}>
            <Image alt="Home banner" width={1114} height={343} src={`${ImagePath}/car/home-img/${item}.png`} className="img-fluid" unoptimized />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarSlider;
