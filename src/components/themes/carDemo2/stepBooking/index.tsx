import React from "react";
import CommonHeader from "../../common/CommonHeader";
import { StepBookingTitle } from "@/constants";
import { StepBookingContentData, stepsData } from "@/data/demo/carDemo2";
import { Col, Container, Row } from "reactstrap";

const StepBooking = () => {
  return (
    <section className='section-t-lg-space car2-step-section'>
      <Container>        
        <CommonHeader title={StepBookingTitle} content={StepBookingContentData} headClass="title-style-5" />
        <div className="step-main-box">
          <Row className="gy-sm-4 gy-2">
            {stepsData.map((step, index) => (
              <Col key={index} xs="12" sm="6" xxl="3">
                <div className="step-box">
                  <span>{step.stepNumber}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default StepBooking;
