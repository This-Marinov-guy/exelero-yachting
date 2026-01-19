"use client";
import Breadcrumbs from "@/components/commonComponents/breadcrumb";
import { RouteList } from "@/utils/RouteList";
import React from "react";
import PortfolioDetailContent from "../common/DetailContent";
import { OurApproachData, ResultsImpactData, TheChallengeData, TheSolutionData } from "@/data/pages/Portfolio";
import { Container } from "reactstrap";
import { ImagePath } from "@/constants";
import RatioImage from "@/utils/RatioImage";

const PortfolioDetail1Container = () => {
  return (
    <div>
      <Breadcrumbs title='Portfolio' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' />
      <section className='section-b-space portfolio-detail-section'>
        <Container>
          <div className='top-section section-b-space ratio_45'>
            <div className='main-top-image'>
              <RatioImage src={`${ImagePath}/portfolio/detail-images/1.jpg`} alt='pd-1' className='img-fluid bg-img' />
            </div>
            <div className='brand-flex'>
              <span>
                <strong>Brand: </strong>Mercedes-Benz
              </span>
              <span>
                <strong>Date: </strong>28-08-2024
              </span>
            </div>
          </div>
          <PortfolioDetailContent title='The Challenge' image='2' data={TheChallengeData} />
          <PortfolioDetailContent title='Our Approach' image='3' data={OurApproachData} rightSide />
          <PortfolioDetailContent title='The Solution' image='4' data={TheSolutionData} />
          <PortfolioDetailContent title='Results &amp; Impact' image='5' data={ResultsImpactData} rightSide />
        </Container>
      </section>
    </div>
  );
};

export default PortfolioDetail1Container;
