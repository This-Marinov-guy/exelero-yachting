import { ImagePath, PeopleSays } from "@/constants";
import RatioImage from "@/utils/RatioImage";
import React from "react";
import { Container } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import CommonHeader from "../../common/CommonHeader";
import { PeopleSayContent, PeopleSayData, ReviewSwiperSetting } from "@/data/demo/jobDemo2";
import { dynamicNumber } from "@/utils";
import Image from "next/image";
import Job2NewsLetter from "../job2NewsLetter";

const PeopleReview = () => {
  
  return (
    <div className='combine-bg overflow-hidden'>
      <RatioImage src={`${ImagePath}/dark-job/bg-effect/newsletter-bg.png`} alt='newsletter-bg' className='bg-img' />
      <section className='dark-testimonial-section'>
        <Container>
          <CommonHeader title={PeopleSays} content={PeopleSayContent} headClass='title-style-4' />
          <Swiper {...ReviewSwiperSetting} pagination={{ clickable: true }} className='dark-testimonial-slider'>  
              {PeopleSayData.map((item, i) => {
                return (
                  <SwiperSlide key={i}>
                    <div className='testimonial-box'>
                      <span className='border-bg' />
                      <p>{item.quote}</p>
                      <div className='testimonial-rating-flex'>
                        <div className='testimonial-profile'>
                          <Image height={50} width={50} src={`${ImagePath}/dark-job/testimonial/1.jpg`} alt='t-1' className='img-fluid' unoptimized/>
                          <div className='testimonial-name'>
                            <h5>{item.name}</h5>
                            <span>{item.role}</span>
                          </div>
                        </div>
                        <ul className='rating-list'>
                          {dynamicNumber(5).map((_, i) => (
                            <li key={i}>
                              <i className='ri-star-s-fill' />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}             
            <div className='swiper-pagination' />
          </Swiper>
        </Container>
      </section>
      <Job2NewsLetter/>
    </div>
  );
};

export default PeopleReview;
