import { ImagePath, Subscribe } from "@/constants";
import Image from "next/image";
import React from "react";
import { Button, Col, Container, Input, InputGroup, Row } from "reactstrap";

const PropertyNewsLetter = () => {
  return (
    <section className='property-newsletter-section pt-0 section-b-space'>
      <div className='overflow-hidden section-t-space'>
        <Container>
          <div className='newsletter-bg-effect'>
            <Row className='align-items-center'>
              <Col lg={5}>
                <div className='newsletter-img' data-aos='zoom-in'>
                  <Image width={481} height={534} src={`${ImagePath}/property/bg-effect/newsletter-build.png`} alt='newsletter-build' className='img-fluid' unoptimized />
                </div>
              </Col>
              <Col lg={7}>
                <div className='newsletter-content'>
                  <h2>Trusted real estate properties for you</h2>
                  <p>There are just two things that are crucial. Family is most important, followed by comfort, so let`s get started with those two.</p>
                  <InputGroup>
                    <Input type='email' placeholder='Your mail address'/>
                    <Button className='btn-solid'>
                      {Subscribe}
                    </Button>
                  </InputGroup>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default PropertyNewsLetter;
