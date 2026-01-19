"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { ImagePath, PortfolioDescription, PortfolioDetailTitle } from "@/constants";
import { BrandFlexData, OurApproachData, ResultsImpactData, TheChallengePara, TheSolutionData } from "@/data/pages/Portfolio";
import { RouteList } from "@/utils/RouteList";
import React from "react";
import PortfolioDetailContent from "../common/DetailContent";
import { Col, Container, Row } from "reactstrap";
import RatioImage from "@/utils/RatioImage";

const PortfolioDetail2Container = () => {
  return (
    <div>
      <Breadcrumbs image title='Portfolio' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' />
      <section className='section-b-space portfolio-detail-section dark-portfolio'>
        <Container>
          <div className='top-section section-b-space ratio_45'>
            <Row>
              <Col lg={8} className='ratio_65'>
                <div className='main-top-image'>
                  <RatioImage src={`${ImagePath}/portfolio/detail-images/1.jpg`} alt='pd-1' className='img-fluid bg-img' />
                </div>
              </Col>
              <Col lg={4}>
                <div className='right-portfolio-image ratio_65'>
                  <div className='portfolio-content-box'>
                    <span className='border-bg' />
                    <h3>{PortfolioDetailTitle}</h3>
                    <p>{PortfolioDescription}</p>
                  </div>
                  <div className='sub-top-image'>
                    <RatioImage src={`${ImagePath}/portfolio/detail-images/4.jpg`} alt='pd-1' className='img-fluid bg-img' />
                  </div>
                </div>
              </Col>
            </Row>             
            <div className="brand-flex">
              {BrandFlexData.map((item, index) => (
                <span key={index}>
                  <strong>{item.title}: </strong>
                  {item.text}
                </span>
              ))}
            </div>
          </div>
          <PortfolioDetailContent title='The Challenge' image='2' data={TheChallengePara} darkMode/>
          <PortfolioDetailContent title='Our Approach' image='3' data={OurApproachData} darkMode rightSide />
          <PortfolioDetailContent title='The Solution' image='4' data={TheSolutionData} darkMode/>
          <PortfolioDetailContent title='Results &amp; Impact' image='5' data={ResultsImpactData} darkMode rightSide />
        </Container>
      </section>
    </div>
  );
};

export default PortfolioDetail2Container;
