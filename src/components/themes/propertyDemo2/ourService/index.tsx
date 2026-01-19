import { SVGPath } from "@/constants";
import { AllServices, ServicesList } from "@/data/demo/propertyDemo2";
import Image from "next/image";
import { Col, Container, Row } from "reactstrap";

const OurService = () => {
  return (
    <section className='property2-service-section'>
      <Container>
        <Row className='justify-content-between gy-xl-0 gy-4'>
          <Col xl={6}>
            <div className='service-content'>
              <h2>Our Services</h2>
              <p>We understand that real estate transactions are more than just buying or selling properties – they are about realizing dreams, making investments, and embracing new beginnings.</p>
              <ul className='check-list'>
                {ServicesList.map((item, i) => {
                  return (
                    <li key={i}>
                      <i className='ri-check-line' />
                      <h6>{item}</h6>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Col>
          <Col xl={6}>
            <div className='service-main'>
              <Row className='justify-content-between gy-lg-4 gy-3'>
                {AllServices.map((item, i) => {
                  return (
                    <Col key={i} md={6}>
                      <div className='service-box'>
                        <div className='service-icon'>
                          <Image height={85} width={85} src={`${SVGPath}/property/service/${i + 1}.svg`} alt='service-1' className='img-fluid' />
                        </div>
                        <div className='service-content'>
                          <h5>{item.title}</h5>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default OurService;
