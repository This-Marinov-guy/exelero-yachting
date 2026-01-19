import { ImagePath, LearnMore } from "@/constants";
import { GoalCounters } from "@/data/demo/jobDemo2";
import { About3List, AboutImageData } from "@/data/demo/jobDemo3";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CountUp from "react-countup";
import { Col, Container, Row } from "reactstrap";

const AboutJob3 = () => {
  return (
    <section className='job3-about'>
      <Container>
        <Row className='justify-content-between align-items-center gy-4'>
          <Col lg={5}>
            <div className='about-img position-relative'>
              {AboutImageData.map((item, i) => (
                <Image height={item.height} width={item.width} key={i} src={`${ImagePath}/job-3/about/${item.image}`} alt='text-object2' className={`img-fluid ${item.class ? item.class : ""}`} unoptimized />
              ))}
            </div>
          </Col>
          <Col lg={6}>
            <div className='about-content'>
              <h2>We Provide a Place to Find Trusted Jobs</h2>
              <p>We will help you to find a job with your interests and help build your project more elegant.</p>
              <ul className='counter-list'>
                {GoalCounters.map((counter, index) => {
                  return (
                    <li key={index} className="counter-box">
                      <div className='counter-flex'>
                        <CountUp end={counter.isK ? counter.value / 1000 : counter.value} suffix={counter.isK ? "K" : ""} duration={10} className='counter' />
                        <i className='ri-add-line' />
                      </div>
                      <h5>{counter.label}</h5>
                    </li>
                  );
                })}
              </ul>
              <ul className='about-list'>
                {About3List.map((item, i) => {
                  return (
                    <li key={i}>
                      <span>{item}</span>
                    </li>
                  );
                })}
              </ul>
              <Link href={RouteList.Pages.Other.AboutUs1} className='btn-solid'>
                {LearnMore}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutJob3;
