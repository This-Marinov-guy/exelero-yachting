import { CompanyTitle, ImagePath, TestimonialLogoTitle } from "@/constants";
import { dynamicNumber } from "@/utils";
import RatioImage from "@/utils/RatioImage";
import { FC } from "react";
import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";

const CompanyLogo: FC<{ testimonial?: boolean }> = ({ testimonial }) => {
  
  return (
    <section className={`${testimonial ? "bg-color" : ""} job-logo-section section-b-space`}>
      <Container>
        <CommonHeader title={testimonial ? TestimonialLogoTitle : CompanyTitle} headClass='title-style-3 text-center' />
        <div className='experience-car-feature'>
          <Row className='row-cols-lg-5 row-cols-2'>
            {dynamicNumber(10).map((value, i) => {
              return (
                <Col className='p-0' key={i}>
                  <div className='logo-img'>
                    <RatioImage src={`${ImagePath}/job/logo/${value}.png`} alt={`l-${value}`} className='img-fluid' />
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

export default CompanyLogo;
