"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { ImagePath } from "@/constants";
import RatioImage from "@/utils/RatioImage";
import { RouteList } from "@/utils/RouteList";
import { Col, Container, Row } from "reactstrap";
import LoginMain from "../common/LoginMain";

const Login1Container = () => {
  return (
    <>
      <Breadcrumbs title='Log In' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' image />
      <section className='section-b-space login-section'>
        <Container>
          <Row className='align-items-center justify-content-center'>
            <Col xl={7} lg={6} className='d-lg-inline-block d-none'>
              <div className='login-img'>
                <RatioImage src={`${ImagePath}/other/1.png`} alt='login-img' className='img-fluid' />
              </div>
            </Col>
            <Col xl={5} lg={6} sm={8}>
              <LoginMain/>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Login1Container;
