import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { FC, useEffect, useRef } from "react";
import { Col, Container, Row } from "reactstrap";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import CommonHeader from "../../common/CommonHeader";
import { ImagePath, ServiceClientTitle, TestimonialsTitle } from "@/constants";
import { TestimonialsContentData, TestimonialsData, TestimonialsSwiperSetting } from "@/data/demo/demo1";
import Image from "next/image";

const Testimonials: FC<{ service?: boolean; type?: string }> = ({ service, type }) => {
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (swiperRef.current) swiperRef.current.init();
  }, []);

  return (
    <>
      {type === "testimonial" ? (
        <section className='car-testimonials-section testimonials-page-section section-b-space'>
          <Container>
            <div className='content-title'>
              <h2>{TestimonialsTitle}</h2>
              <p>{TestimonialsContentData}</p>
            </div>
            <Row className='gy-4'>
              {TestimonialsData.map((testimonial, index) => (
                <Col xl={4} md={6} key={index}>
                  <div className='testimonials-box'>
                    <div className='testimonials-image'>
                      <div className='gradient-box' />
                      <div className='white-box' />
                      <Image height={146} width={146} src={`${ImagePath}/${testimonial.image}`} alt={`t-${index + 1}`} className='img-fluid' unoptimized/>
                    </div>
                    <div className='testimonials-content'>
                      <h4>{testimonial.name}</h4>
                      <h6>- {testimonial.location}</h6>
                      <p>&quot;{testimonial.testimonial}&quot;</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      ) : (
        <section className='car-testimonials-section section-b-space'>
          <Container>
            {service ? <CommonHeader title={ServiceClientTitle} content={TestimonialsContentData} headClass='content-title text-start' animation /> : <CommonHeader title={TestimonialsTitle} content={TestimonialsContentData} headClass='title-style-2' animation />}
            <Swiper {...TestimonialsSwiperSetting} onInit={(swiper: SwiperType) => (swiperRef.current = swiper)}>
              {TestimonialsData.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className='testimonials-box'>
                    <div className='testimonials-image'>
                      <div className='gradient-box' />
                      <div className='white-box' />
                      <Image height={146} width={146} src={`${ImagePath}/${testimonial.image}`} alt={`t-${index + 1}`} className='img-fluid' unoptimized/>
                    </div>
                    <div className='testimonials-content'>
                      <h4>{testimonial.name}</h4>
                      <h6>- {testimonial.location}</h6>
                      <p>&quot;{testimonial.testimonial}&quot;</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <div className='swiper-flex car-arrow'>
                <div className='swiper-button-prev'>
                  <ArrowLeft2 className="iconsax" />
                </div>
                <div className='swiper-button-next'>
                  <ArrowRight2 className="iconsax" />
                </div>
              </div>
            </Swiper>
          </Container>
        </section>
      )}
    </>
  );
};

export default Testimonials;
