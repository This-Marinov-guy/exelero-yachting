import React from "react";
import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";
import { useAppSelector } from "@/redux/hooks";
import Job1DetailBox from "@/components/commonComponents/productBox/Job1DetailBox";
import { JobHereTitle } from "@/constants";
import { JobHereContentData } from "@/data/demo/jobDemo1";

const JobHere = () => {
  const { productItem } = useAppSelector((state) => state.product);
  return (
    <section className='job-box-section section-b-space'>
      <Container>
      <CommonHeader title={JobHereTitle} content={JobHereContentData} headClass="title-style-3 text-center" />
        <Row className='g-4'>
          {productItem.filter(({ id }) => id >= 16 && id <= 21).map((jobData, i) => (
              <Col xl={4} md={6} key={i} data-aos="fade-up" data-aos-duration={200 * (i + 1)} >
                <Job1DetailBox data={jobData} />
              </Col>
            ))}
        </Row>
      </Container>
    </section>
  );
};

export default JobHere;
