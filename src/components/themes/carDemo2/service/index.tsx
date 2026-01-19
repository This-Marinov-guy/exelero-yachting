import { ImagePath, LearnMore, OurDedication, SVGPath } from "@/constants";
import { OurDedicationContent, servicesData } from "@/data/demo/carDemo2";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";
import { FC } from "react";
import { About3StartImage } from "@/data/pages/Others";
import RatioImage from "@/utils/RatioImage";

const ServiceSection: FC<{ about?: boolean }> = ({ about }) => {
  return (
    <section className={`${about ? "car2-service-section car2-about-section" : "section-t-lg-space section-b-lg-space car2-service-section"}`}>
      <Container>
        <Row className={`${about ? "justify-content-center gy-4" : "align-items-center gy-sm-4 gy-3"}`}>
          {about ? (
            <Col lg={5} md={8}>
              <div className='about-img'>
                <img src={`${SVGPath}/job/a-1.svg`} alt='a-1' className='img-fluid about-object' />
                <Row className='gx-lg-4 gx-sm-5'>
                  {[...About3StartImage].reverse().map((colImages, colIndex) => (
                    <Col xs='6' key={colIndex} className={colIndex === 1 ? "text-end" : ""}>
                      {colImages.map((image, imgIndex) => (
                        <RatioImage key={imgIndex} src={`${ImagePath}/${image.src}`} alt='a-1' className='img-fluid' />
                      ))}
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          ) : (
            <Col lg='6'>
              <div className='service-img'>
                <Image src={`${ImagePath}/car2/service-img.jpg`} alt='service-img' className='img-fluid' width={676} height={516} unoptimized />
              </div>
            </Col>
          )}
          <Col lg='6'>
            <div className='service-content'>
              <CommonHeader title={OurDedication} content={OurDedicationContent} />
              <ul className='service-list'>
                {servicesData.map((service, index) => (
                  <li key={index}>
                    <div className='service-icon'>
                      <Image src={`${SVGPath}/${service.icon}`} alt={`service-icon-${index}`} className='img-fluid' width={40} height={40} />
                    </div>
                    <h6>{service.title}</h6>
                  </li>
                ))}
              </ul>
              <Link href={RouteList.Car.Detail.CarClassic} className='btn-pills'>
                {LearnMore}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ServiceSection;
