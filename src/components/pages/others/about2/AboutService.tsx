import { ImagePath, SVGPath } from "@/constants";
import { ServiceData } from "@/data/demo/demo1";
import RatioImage from "@/utils/RatioImage";
import Image from "next/image";
import React from "react";
import { Col, Container, Row } from "reactstrap";

const AboutService = () => {
  const CategoryBox = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
    <div className='category-box'>
      <Image width={54} height={74} src={`${SVGPath}/job/job-box/dots-category.svg`} alt='dots-category' className='img-fluid dot-img' />
      <div className='category-icon'>{icon}</div>
      <div className='category-title'>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );

  return (
    <section className='car2-about job-category-section car-about-category section-b-space position-relative'>
      <Container>
        <Row className='m-auto align-items-center justify-content-between'>
          <Col lg={6} className='p-0 d-lg-inline-block d-none'>
            <div className='about-img'>
              <RatioImage src={`${ImagePath}/car2/service-img.jpg`} alt='about-img' className='img-fluid' />
            </div>
          </Col>
          <Col lg={6}>
            <div className='about-content'>
              <Row className='g-4'>
                {ServiceData.slice(0, 2).map((item, i) => (
                  <Col key={i} sm={6}>
                    <CategoryBox icon={item.icon} title={item.title} description={item.description} />
                  </Col>
                ))}
              </Row>
              <Row className="mt-sm-4 mt-0 g-4 translate-row">
                {ServiceData.slice(2).map((service, index) => (
                  <Col sm="6" key={index}>
                    <CategoryBox icon={service.icon} title={service.title} description={service.description} />
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutService;
