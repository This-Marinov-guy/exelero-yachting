import { ChooseUs, ImagePath, LearnMore, SVGPath } from "@/constants";
import RatioImage from "@/utils/RatioImage";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";
import { AboutListData, ChooseUsContent } from "@/data/demo/carDemo2";

const AboutUs = () => {
  return (
    <section className='car2-about section-t-lg-space position-relative'>
      <RatioImage src={`${ImagePath}/car2/bg-effect/about-bg.png`} alt='about-bg' className='img-fluid position-absolute dots-bg' />
      <Container>
        <Row className='m-auto align-items-center justify-content-between'>
          <Col lg={6} className='p-0 d-lg-inline-block d-none'>
            <div className='about-img'>
              <Image width={825} height={607} src={`${ImagePath}/car2/about-img.png`} alt='about-img' className='img-fluid' unoptimized/>
            </div>
          </Col>
          <Col lg={6}>
            <div className='about-content'>
            <CommonHeader title={ChooseUs} content={ChooseUsContent} />
              <ul className="about-list">
                {AboutListData.map((item, index) => (
                  <li key={index}>
                    <div className="about-icon">
                      <Image height={40} width={40} src={`${SVGPath}/${item.src}`} alt="image" className="img-fluid" unoptimized/>
                    </div>
                    <h6>{item.text}</h6>
                  </li>
                ))}
              </ul>
              <Link href={RouteList.Pages.Other.AboutUs1} className='btn-pills'>
                {LearnMore}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutUs;
