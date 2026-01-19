'use client';
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import { Col, Container, Row } from "reactstrap";
import SignUpMain from "../common/SignUpMain";
import RatioImage from "@/utils/RatioImage";
import { ImagePath } from "@/constants";

const Signup1Container = () => {
  return (
    <>
      <Breadcrumbs title='Sign Up' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />
      <section className='section-b-space login-section'>
        <Container>
          <Row className='align-items-center justify-content-center'>
            <Col xl={7} lg={6} className='d-lg-inline-block d-none'>
              <div className='login-img'>
                <RatioImage src={`${ImagePath}/other/1.png`} alt='login-img' className='img-fluid' />
              </div>
            </Col>
            <Col xl={5} lg={6} sm={8}>
              <SignUpMain />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Signup1Container;
