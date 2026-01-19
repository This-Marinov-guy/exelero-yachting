import { ImagePath, StepToFollow } from "@/constants";
import { JobStepContentData, JobStepData, StepToFollowContent } from "@/data/demo/jobDemo1";
import RatioImage from "@/utils/RatioImage";
import React from "react";
import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";

const JobSteps = () => {
  return (
    <section className='job-step-section pt-0'>
      <Container>
        <Row className='gx-lg-5 align-items-center'>
          <Col xl={4} lg={5}>
            <div className='step-img'>
              <Row className='gx-xl-5'>
                {JobStepData.map((step, index) => (
                  <Col xs={6} key={index}>
                    <div className='step-inner-img'>
                      {step.images.map((image, imgIndex) => (
                        <RatioImage src={`${ImagePath}/${image.src}`} alt={image.alt} className={image.className} key={imgIndex} />
                      ))}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
          <Col xl={8} lg={7}>
            <CommonHeader title={StepToFollow} content={StepToFollowContent} headClass='title-style-3 dark-title' />
            <Row className='g-xl-5 gy-4'>
              {JobStepContentData.map((step, index) => (
                <Col md={6} key={index}>
                  <div className='step-content-box'>
                    <div className='step-icon-number'>
                      <div className='step-icon'>
                       {step.icon}
                      </div>
                      <span>{step.stepNumber}</span>
                    </div>
                    <div className='step-content'>
                      <h5>{step.title}</h5>
                      <p>{step.description}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default JobSteps;
