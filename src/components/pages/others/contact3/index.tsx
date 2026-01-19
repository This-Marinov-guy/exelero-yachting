import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import React, { Fragment } from "react";
import { Col, Container, Row } from "reactstrap";
import ContactForm from "../common/ContactForm";
import GetInTouch from "../common/GetInTouch";
import Map from "../common/Map";
import { Talk } from "@/constants";
import { contactUs3Description } from "@/data/pages/Others";

const Contact3Container = () => {
  return (
    <Fragment>
      <Breadcrumbs title='Contact Us' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />
      <section className='contact-section section-b-space'>
        <Container>
          <Row className='gx-md-5 gy-4'>
            <Col lg={7} md={6}>
              <div className='left-contact'>
                <div className='content-title text-start'>
                  <h2>{Talk}</h2>
                  <p className='mx-0'>{contactUs3Description}</p>
                </div>
                <ContactForm />
              </div>
            </Col>
            <Col lg={5} md={6}>
              <div className='right-contact'>
                <Map />
                <GetInTouch type='contact-3' />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Fragment>
  );
};

export default Contact3Container;
