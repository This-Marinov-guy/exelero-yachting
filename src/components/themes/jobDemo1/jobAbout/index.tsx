import { ImagePath, LearnMore, SVGPath } from "@/constants";
import { AboutImagesData, JobCounters } from "@/data/demo/jobDemo1";
import RatioImage from "@/utils/RatioImage";
import { RouteList } from "@/utils/RouteList";
import { Add, ArrowRight } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CountUp from "react-countup";
import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";

const JobAbout = () => {
  return (
    <section className='job-about-section section-b-space'>
      <Container>
        <Row className='justify-content-center gy-4 align-items-center'>
          <Col xl={7} lg={6} className='order-lg-0 order-1'>
            <div className='about-content'>              
              <CommonHeader title="We Provide a Place to Find Trusted Jobs" content="We will help you to find a job with your interests and help build your project more elegant."/>
              <ul className='about-list'>
                <li>Say goodbye to endless scrolling through unreliable job postings.</li>
                <li>Receive personalized job suggestions that match your criteria.</li>
                <li>We`re more than just a job board.</li>
              </ul>
              <ul className='job-counter-box'>
                {JobCounters.map((counter, index) => (
                  <li className='counter-box' key={index}>
                    <div className='counter-flex'>
                      <CountUp className="counter" end={counter.value} delay={5}/>                        
                      <Add className='iconsax' size={25} color='' />
                    </div>
                    <h5>{counter.label}</h5>
                  </li>
                ))}
              </ul>
              <Link href={RouteList.Pages.Other.AboutUs1} className='text-btn'>
                {LearnMore}
                <ArrowRight className="iconsax"/>
              </Link>
            </div>
          </Col>
          <Col xl={5} lg={6} md={8}>
            <div className='about-img'>
              <Row className='gx-lg-4 gx-sm-5'>
                {AboutImagesData.map((colImages, colIndex) => (
                  <Col xs='6' key={colIndex}>
                    {colImages.map((image, imgIndex) => (
                      <RatioImage key={imgIndex} src={`${ImagePath}/${image.src}`} alt='a-1' className='img-fluid' />
                    ))}
                  </Col>
                ))}
              </Row>
              <Image height={90} width={90} src={`${SVGPath}/job/a-1.svg`} alt='a-1' className='img-fluid about-object' />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default JobAbout;
