import { Href, ImagePath, LearnMore } from "@/constants";
import { ExperienceData, ExperiencePoints } from "@/data/demo/propertyDemo2";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Col, Container, Row } from "reactstrap";

const Experience = () => {
  return (
    <section className='section-t-lg-space property2-experience-section'>
      <Container>
        <Row className='gy-lg-0 gy-4'>
          <Col lg={7}>
            <div className='experience-img'>
              {ExperienceData[0].items.map((item) => (
                <div key={item.id} className={`${item.position}-img`}>
                  {item.heading && (
                    <h2>
                      <span>{item.heading.years}</span>
                      {item.heading.text}
                    </h2>
                  )}
                  <Image height={item.image.height} width={item.image.width} src={`${ImagePath}${item.image.src}`} alt={item.image.alt} className='img-fluid' unoptimized/>
                  {item.hasEffectCircle && <span className='effect-circle' />}
                </div>
              ))}
            </div>
          </Col>
          <Col lg={5}>
            <div className='experience-content'>
              <h2>We are the most remarkable and trustworthy real estate</h2>
              <p>we redefine the essence of real estate. With a legacy of trust and excellence, we present to you the pinnacle of luxury living.</p>
              <ul className='check-list'>
                {ExperiencePoints.map((item, i) => {
                  return (
                    <li key={i}>
                      <i className='ri-check-line' />
                      <h6>{item}</h6>
                    </li>
                  );
                })}
              </ul>
              <Link scroll={false} href={Href} className='btn-solid'>
                {LearnMore}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Experience;
