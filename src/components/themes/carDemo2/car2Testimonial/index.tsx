import { SVGPath, TestimonialsTitle } from "@/constants";
import { Car2TestimonialData, Testimonials, TestimonialsContentData2 } from "@/data/demo/carDemo2";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { Container } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import CommonHeader from "../../common/CommonHeader";
import { FC } from "react";

const Car2Testimonial: FC<{ about?: boolean }> = ({ about }) => {
  return (
    <section className={`${about ? "car2-about-testimonial" : " section-t-lg-space"} car2-testimonial-section`}>
      <Container>
        <CommonHeader title={TestimonialsTitle} content={TestimonialsContentData2} headClass='title-style-5' />
        <Swiper {...Car2TestimonialData} pagination={{ clickable: true }}>
          <div className='swiper-wrapper'>
            {Testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className='testimonial-box'>
                  <Image width={60} height={60} src={`${SVGPath}/car2/quote.svg`} alt='quote' className='img-fluid' />
                  <p>{testimonial.text}</p>
                  <div className='profile-flex'>
                    <div className='profile-name'>
                      <h5>-{testimonial.name}</h5>
                      <span>{testimonial.designation}</span>
                    </div>
                    <ul className='rating-list'>
                      <li>
                        <Rating initialValue={4} size={20} />
                      </li>
                      <li>{testimonial.rating}</li>
                    </ul>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </div>
          <div className='swiper-pagination' />
        </Swiper>
      </Container>
    </section>
  );
};

export default Car2Testimonial;
