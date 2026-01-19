import { Href, ImagePath } from "@/constants";
import { dynamicNumber } from "@/utils";
import RatioImage from "@/utils/RatioImage";
import Link from "next/link";
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { FreeMode, Mousewheel, Thumbs } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

const StickySlider = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  return (
    <div className='detail-images'>
      <Row>
        <Col md={2} className='order-md-0 order-1'>
          <Swiper
            slidesPerView={6}
            loop={true}
            direction={"vertical"}
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Thumbs]}
            breakpoints={{
              0: {
                slidesPerView: 3,
                direction: "horizontal",
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 6,
              },
            }}
            spaceBetween={30}
            className='sub-vertical-image ratio_asos'
          >
            <div className='swiper-wrapper'>
              {dynamicNumber(9).map((img, i) => (
                <SwiperSlide key={i}>
                  <Link scroll={false} href={Href} className='detail-sub-image'>
                    <RatioImage src={`${ImagePath}/property/detail-main/${img}.jpg`} alt={`ds-${img}`} className='img-fluid bg-img' />
                  </Link>
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </Col>
        <Col md={10}>
          <Swiper
            direction={"vertical"}
            loop={true}
            watchSlidesProgress={true}
            slidesPerView={1}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[Mousewheel, Thumbs]}
            breakpoints={{
              0: {
                direction: "horizontal",
              },
              768: {
                direction: "vertical",
              },
            }}
            className='main-vertical-image ratio_asos'
          >
            {dynamicNumber(9).map((img, i) => (
              <SwiperSlide key={i}>
                <Link scroll={false} href={Href} className='detail-main-image'>
                  <RatioImage src={`${ImagePath}/property/detail-main/${img}.jpg`} alt={`ds-${img}`} className='img-fluid bg-img' />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </Col>
      </Row>
    </div>
  );
};

export default StickySlider;
