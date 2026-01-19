"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import CommonHeader from "@/components/themes/common/CommonHeader";
import { GetInTouchTitle, ImagePath } from "@/constants";
import { Contact1Description } from "@/data/pages/Others";
import { RouteList } from "@/utils/RouteList";
import { Col, Container, Row } from "reactstrap";
import ContactForm from "../others/common/ContactForm";
import GetInTouch from "../others/common/GetInTouch";
import FollowUs from "../others/common/FollowUs";

const ContactContainer = () => {
  return (
    <>
      <Breadcrumbs title='Contact Us' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />
      <section className='contact-section contact-2-section'>
        <Container>
          <Row className="gy-xl-0 gy-4 justify-content-center">
            <GetInTouch type='contact-2' />
                        {/* <FollowUs/> */}

          </Row>
          <Row className='section-t-md-space gy-lg-0 gy-4'>
            <Col lg={6}>
              <div className="contact-img">
                <img src={`${ImagePath}/other/contact.jpg`} alt="1.jpg" className="img-fluid" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="form-box">
                <CommonHeader title={GetInTouchTitle} content={Contact1Description} headClass='content-title text-center' contentClass="mx-0 w-100" />
                <ContactForm />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ContactContainer;
