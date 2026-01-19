import { ImagePath } from "@/constants";
import { PaymentData, SVGImage } from "@/data/demo/jobDemo3";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Col, Container, Row } from "reactstrap";

const Job3NewsLetter = () => {
  return (
    <section className='section-b-space job3-newsletter'>
      <Container>
        <div className='newsletter-box position-relative'>           
          {SVGImage.map((item,i) => {
            return (
              <Image src={`${ImagePath}/job-3/bg-effect/c-${item.image}.png`} alt='svg-img' height={item.height} width={item.width} key={i} className={`img-fluid circle-${item.image} position-absolute svg-img d-lg-block d-none`} unoptimized />
            );
          })}
          <Row className='justify-content-between'>
            <Col lg={6}>
              <div className='newsletter-content'>
                <h2>Get your Dream Job Easily</h2>
                <p>Whether you`re a recent graduate, seasoned professional, or exploring new career paths, our app has you covered.</p>
                <div className='pay-flex-btn'>
                  {PaymentData.map((item, index) => (
                    <Link href={item.utl} key={index}>
                      <Image width={150} height={45} src={`${ImagePath}/job-3/${item.image}`} alt='g-pay' className='img-fluid' unoptimized />
                    </Link>
                  ))}
                </div>
              </div>
            </Col>
            <Col xxl={5} xs={6} className='d-lg-block d-none'>
              <div className='newsletter-img h-100'>
                <Image width={493} height={333} src={`${ImagePath}/job-3/phone-mockup.png`} alt='phone-mockup' className='img-fluid h-100' unoptimized />
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default Job3NewsLetter;
