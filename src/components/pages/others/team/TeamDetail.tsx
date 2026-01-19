import { ImagePath, OurFounderTitle } from "@/constants";
import { PersonsDetail } from "@/data/pages/Others";
import RatioImage from "@/utils/RatioImage";
import { Fragment } from "react";
import { Col, Container, Row } from "reactstrap";

const TeamDetail = () => {
  return (
    <section className='bg-color team-info-section'>
      <Container>
        <h2 className='text-center'>{OurFounderTitle}</h2>
        <Fragment>
          {PersonsDetail.map((person) => (
            <Row key={person.id} className={`justify-content-center align-items-center gx-lg-5 mt-3 ${person.isRightAligned ? "right-img-box" : ""}`}>
              <Col xl={3} lg={4} md={5} className={`${person.isRightAligned ? "order-1" : ""} d-md-block d-none`}>
                <div className='person-img'>
                  <RatioImage src={`${ImagePath}/${person.image}`} alt={person.alt} className='img-fluid w-100' />
                </div>
              </Col>
              <Col md={7}>
                <div className='person-info'>
                  <h2>
                    <i className='ri-double-quotes-l' />
                    {person.quote}
                    <i className='ri-double-quotes-r' />
                  </h2>
                  <p>{person.description}</p>
                  <div className='person-title'>
                    <h5>{person.name}</h5>
                    <h6>{person.title}</h6>
                  </div>
                </div>
              </Col>
            </Row>
          ))}
        </Fragment>
      </Container>
    </section>
  );
};

export default TeamDetail;
