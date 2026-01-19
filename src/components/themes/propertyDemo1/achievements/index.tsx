import { ImagePath, OurAchievementsTitle, SVGPath } from "@/constants";
import Image from "next/image";
import React from "react";
import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";
import { AchievementCounter, OurAchievementsContent } from "@/data/demo/propertyDemo1";
import CountUp from "react-countup";

const Achievements = () => {
  return (
    <section className='property-achievements-section section-b-space'>
      <Container>
        <Row className='align-items-center gx-lg-5 gy-lg-5 gy-4'>
          <Col lg={6}>
            <div className='achievements-img'>
              <Image width={664} height={718} src={`${ImagePath}/property/achievements/1.png`} alt='achievements' className='img-fluid' />
            </div>
          </Col>
          <Col lg={6}>
            <div className='achievements-content'>
              <CommonHeader title={OurAchievementsTitle} content={OurAchievementsContent} headClass='title-style-1' />
              <ul className='achievements-counter-box'>
                {AchievementCounter.map((item, i) => {
                  return (
                    <li className='counter-box' key={i}>
                      <span>                      
                        <CountUp end={item.end} delay={0} />
                        {item.suffix}
                      </span>
                      <h6>{item.label}</h6>
                    </li>
                  );
                })}
              </ul>
              <div className='achievements-circle'>
                <Image height={143} width={143} src={`${SVGPath}/property/achievement/achievements-circle.svg`} alt='achievements-circle' className='img-fluid' />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Achievements;
