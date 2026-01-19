import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";
import { ImagePath, ServiceTitle } from "@/constants";
import { ServiceContentData, ServiceData } from "@/data/demo/demo1";
import Image from "next/image";

const Services = () => {
  return (
    <section className='car-service-section section-b-space'>
      <Container>
        <CommonHeader title={ServiceTitle} content={ServiceContentData} headClass='title-style-2 dark-title' animation />
      </Container>
      <div className='padding-container-right'>
        <Row className='align-items-center'>
          <Col xxl='8' xl='7' className='d-xl-block d-none'>
            <div className='service-image' data-aos='fade-right' data-aos-offset={200}>
              <Image width={911} height={455} src={`${ImagePath}/car/service-car.png`} alt='service-car' className='img-fluid' unoptimized />
            </div>
          </Col>
          <Col xxl='4' xl='5'>
            <Row className='g-md-5 g-4'>
                {ServiceData.map((service, index) => (
                  <Col sm='6' key={index}>
                    <div className='service-box'>
                      <div className='service-icon'>{service.icon}</div>
                      <div className='service-content'>
                        <h4>{service.title}</h4>
                        <p>{service.description}</p>
                      </div>
                    </div>
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Services;
