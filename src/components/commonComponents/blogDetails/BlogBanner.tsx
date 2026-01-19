import { ImagePath } from "@/constants";
import { BlogsDetailSliderData, SliderImage } from "@/data/pages/Blog";
import RatioImage from "@/utils/RatioImage";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import React, { FC, Fragment } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

const BlogBanner: FC<{ type?: string }> = ({ type }) => {
  return (
    <Fragment>
      <div className={`${type === "slider" ? "position-relative" : type === "blog-quote" ? "blog-info quote-box" : "banner-img"}`}>
        {type === "video" ? (
          <iframe src='https://www.youtube.com/embed/C3G6_Tqr5K8' title='A Guide to Creating Real Estate Blog Posts' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerPolicy='strict-origin-when-cross-origin' allowFullScreen></iframe>
        ) : type === "audio" ? (
          <iframe allow='autoplay' src='https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1780764978&color=%23188aec&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true'></iframe>
        ) : type === "slider" ? (
          <Fragment>
            <Swiper {...BlogsDetailSliderData} className='blog-detail-slider'>
              {SliderImage.map((item, i) => {
                return (
                  <SwiperSlide key={i}>
                    <div className='banner-img'>
                      <RatioImage src={`${ImagePath}/blog/${item}.jpg`} alt='b-1' className='img-fluid bg-img' />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <div className='swiper-flex box-arrow'>
              <div className='swiper-button-prev blog-prev-detail'>
                <ArrowLeft2 className='iconsax'/>
              </div>
              <div className='swiper-button-next blog-next-detail'>
                <ArrowRight2 className='iconsax'/>
              </div>
            </div>
          </Fragment>
        ) : type === "blog-quote" ? (
          <h2>
            <i className='ri-double-quotes-l' />
            As a beginner in the world of cooking, this blog has been my saving grace. The recipes are easy to follow, and the tips have truly elevated my culinary skills
            <i className='ri-double-quotes-r' />
          </h2>
        ) : (
          <RatioImage src={`${ImagePath}/blog/3.jpg`} alt='b-1' className='img-fluid bg-img' />
        )}
      </div>
    </Fragment>
  );
};

export default BlogBanner;
