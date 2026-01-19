import { ImagePath } from "@/constants";
import { ServiceCount } from "@/data/pages/Others";
import RatioImage from "@/utils/RatioImage";
import React from "react";
import CountUp from "react-countup";
import { Col, Container, Row } from "reactstrap";

const Score = () => {
  return (
    <section className='counter-section'>
      <Container>
        <div className='counter-bg-img'>
          <RatioImage src={`${ImagePath}/car/bg-effect/service-bg.png`} alt='counter-bg' className='img-fluid bg-img' />
          <Row className='justify-content-center gy-4 gy-lg-0'>
            {ServiceCount.map((item, i) => {
              return (
                <Col lg={3} sm={6} key={i}>
                  <div className='counter-box'>
                    <div>
                      <h2>
                        <span className='counter'>
                          <CountUp start={0} end={item.value} duration={10} />
                        </span>
                        {item.suffix}
                      </h2>
                      <h4>{item.title}</h4>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default Score;
