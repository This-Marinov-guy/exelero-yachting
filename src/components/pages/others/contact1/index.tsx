"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { ContactUs, GetInTouchTitle, ImagePath } from "@/constants";
import { Contact1Description } from "@/data/pages/Others";
import RatioImage from "@/utils/RatioImage";
import { RouteList } from "@/utils/RouteList";
import { Col, Container, Row } from "reactstrap";
import ContactForm from "../common/ContactForm";
import GetInTouch from "../common/GetInTouch";
import Map from "../common/Map";

const Contact1Container = () => {
  return (
    <>
      <Breadcrumbs title='Contact Us' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />
      <section className='contact-section'>
        <Container>
          <div className='content-title'>
            <h2>{GetInTouchTitle}</h2>
            <p>{Contact1Description}</p>
          </div>
          <GetInTouch type='contact-1' />
          <div className='section-t-md-space'>
            <Row className='g-lg-5 gy-4'>
              <Col lg={7} md={6} className="form-box">
              <h3 className="mb-3">{ContactUs}</h3>
                <ContactForm />
              </Col>
              <Col lg={5} md={6}>
                <Map />
              </Col>
            </Row>
          </div>
        </Container>
        <div className='text-center section-t-space overflow-hidden'>
          <RatioImage src={`${ImagePath}/other/contact.png`} alt='contact' className='img-fluid contact-image' />
        </div>
      </section>
    </>
  );
};

export default Contact1Container;
