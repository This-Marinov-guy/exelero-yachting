import { ImagePath } from "@/constants";
import { BreadcrumbThumbNav, BreadcrumbThumbs } from "@/data/property";
import { dynamicNumber } from "@/utils";
import RatioImage from "@/utils/RatioImage";
import Image from "next/image";
import React, { useState } from "react";
import { Container } from "reactstrap";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

const ThumbSliderSet = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  return (
    <>
      <Swiper {...BreadcrumbThumbs} thumbs={{ swiper: thumbsSwiper }} className='breadcrumb-thumbs ratio_40 ratio_media_landscape'>
        {dynamicNumber(9).map((img, i) => (
          <SwiperSlide key={i} className="bg-size">
            <RatioImage src={`${ImagePath}/property/detail-main/${img}.jpg`} className='img-fluid bg-img' alt={`b-thumb-${i + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='thumb-set'>
        <Container>
          <Swiper {...BreadcrumbThumbNav} onSwiper={setThumbsSwiper} className='breadcrumb-thumb'>
            {dynamicNumber(9).map((img, i) => (
              <SwiperSlide key={i} className="small-breadcrumb-img">
                <Image height={179} width={179} src={`${ImagePath}/property/detail-main/${img}.jpg`} className='img-fluid bg-img' alt={`b-thumb-${i + 1}`} unoptimized/>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </div>
    </>
  );
};

export default ThumbSliderSet;
