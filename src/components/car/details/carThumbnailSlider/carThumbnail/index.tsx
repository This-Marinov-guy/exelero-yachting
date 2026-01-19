import { Href, ImagePath } from "@/constants";
import { BackSlider, FrontSlider } from "@/data/car";
import { dynamicNumber } from "@/utils";
import RatioImage from "@/utils/RatioImage";
import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

const CarThumbnailSet = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  return (
    <>
      <div className='style-breadcrumbs-4'>
        <div className='car-detail-image'>
          <Swiper className='back-slider ratio_45' {...BackSlider} thumbs={{ swiper: thumbsSwiper }}>
            {dynamicNumber(8).map((img, i) => (
              <SwiperSlide key={i}>
                <a href={Href} className='back-img'>
                  <RatioImage src={`${ImagePath}/car/black-images/${img}.jpg`} className='img-fluid bg-img' alt={`b-thumb-${i + 1}`} />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper className='front-slider' {...FrontSlider} direction='vertical' onSwiper={setThumbsSwiper}>
            {dynamicNumber(8).map((img, i) => (
              <SwiperSlide key={i}>
                <a href={Href} className='front-img'>
                  <Image height={110} width={120} src={`${ImagePath}/car/black-images/${img}.jpg`} className='img-fluid ' alt={`b-thumb-${i + 1}`} unoptimized/>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default CarThumbnailSet;
