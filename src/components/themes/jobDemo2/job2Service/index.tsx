import { ImagePath, LearnMore, ProvideJobs, SVGPath } from "@/constants";
import { GoalCounters, ProvideJobsContent, ServiceIcons, ServiceList } from "@/data/demo/jobDemo2";
import { RouteList } from "@/utils/RouteList";
import Link from "next/link";
import React from "react";
import CountUp from "react-countup";
import CommonHeader from "../../common/CommonHeader";
import { Col, Container, Row } from "reactstrap";
import Image from "next/image";

const Job2Service = () => {
  return (
    <section className='dark-service-section'>
      <Container>
        <Row className='align-items-center gy-4'>
          <Col xl={6} lg={5}>
            <div className='service-img'>
              <Image width={620} height={565} src={`${ImagePath}/dark-job/service/service-img.png`} alt='service-img' className='img-fluid' unoptimized/>
              <ul className='service-icon'>
                {ServiceIcons.map((icon, index) => (
                  <li data-aos='zoom-in' key={index}>
                    <Image height={70} width={70} src={`${SVGPath}/${icon.src}`} alt={icon.alt} className='img-fluid' />
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col xl={6} lg={5}>
            <div className='service-content'>
              <CommonHeader title={ProvideJobs} content={ProvideJobsContent} />
              <ul className='service-list'>
                {ServiceList.map((item, i) => {
                  return (
                    <li key={i}>
                      <span>{item}</span>
                    </li>
                  );
                })}
              </ul>
              <ul className='counter-list'>
                {GoalCounters.map((counter, index) => (
                  <li className='counter-box' key={index}>
                    <div className='counter-flex'>
                      <CountUp end={counter.isK ? counter.value / 1000 : counter.value} suffix={counter.isK ? "K" : ""} duration={10} className='counter' />
                      <i className='ri-add-line' />
                    </div>
                    <h5>{counter.label}</h5>
                  </li>
                ))}
              </ul>
              <Link href={RouteList.Pages.Other.AboutUs1} className='border-pills'>
                {LearnMore}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Job2Service;
