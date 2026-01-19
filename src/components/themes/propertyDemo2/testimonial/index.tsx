import { CityTitle } from "@/constants";
import { TestimonialData } from "@/data/demo/propertyDemo2";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";
import { dynamicNumber } from "@/utils";

const Testimonial = () => {
  return (
    <section className='car2-testimonial-section section-t-lg-space'>
      <Container>
        <CommonHeader title={CityTitle} headClass='title-style-1 title-style-6' subClass='horizontal-title' url={RouteList.Pages.Other.Testimonial} view />
        <Row className='justify-content-center g-4'>
          {TestimonialData.map((testimonial) => (
            <Col xl={4} md={6} key={testimonial.id}>
              <div className='testimonial-box'>
                <Image width={50} height={50} src={testimonial.icon} alt='quote' className='img-fluid' />
                <p>{testimonial.quote}</p>
                <div className='profile-flex'>
                  <div className='profile-name'>
                    <h5>-{testimonial.name}</h5>
                  </div>
                  <ul className='rating-list'>
                    {dynamicNumber(testimonial.stars).map((_, index) => (
                      <li key={index}>
                        <i className='ri-star-s-fill' />
                      </li>
                    ))}
                    <li>
                      <i className='ri-star-s-line' />
                    </li>
                    <li>{testimonial.rating}</li>
                  </ul>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Testimonial;
