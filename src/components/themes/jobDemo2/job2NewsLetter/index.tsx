import React from "react";
import { Button, Col, Container, Input, Row } from "reactstrap";

const Job2NewsLetter = () => {
  return (
    <section className='dark-newsletter-section'>
      <Container>
        <div className='newsletter-box'>
          <Row className='justify-content-between align-items-center'>
            <Col lg={5}>
              <h2 className='text-white text-lg-start text-center mb-lg-0 mb-3'>Find your Next Grate Job Opportunity!</h2>
            </Col>
            <Col lg={6}>
              <div className='search-pill'>
                <Input type='text' className='form-control' placeholder='Enter your email address' />
                <Button className='btn-pills'>
                  Subscribe
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default Job2NewsLetter;
