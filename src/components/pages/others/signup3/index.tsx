"use client";
import { DiscoveryPlace, FindPlace, ImagePath } from "@/constants";
import RatioImage from "@/utils/RatioImage";
import { RouteList } from "@/utils/RouteList";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import SignUpMain from "../common/SignUpMain";

const Signup3Container = () => {
  return (
    <section className='pt-0 login-section login-3 overflow-hidden'>
      <Container fluid className='p-0'>
        <Row>
          <Col lg={6} className='p-0'>
            <div className='d-flex align-items-center justify-content-center h-100'>
              <SignUpMain classname='signup-form' />
            </div>
          </Col>
          <Col lg={6} className='p-0'>
            <div className='login3-image'>
              <RatioImage src={`${ImagePath}/other/auth/signup.jpg`} alt='s2' className='bg-img' />
              <div className='login3-content'>
                <Link href={RouteList.Home.CarDemo1} className='login-logo'>
                  <RatioImage src={`${ImagePath}/logo/1.png`} alt='logo' />
                </Link>
                <h2>{FindPlace}</h2>
                <p>{DiscoveryPlace}</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Signup3Container;
